import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


import { EquipmentReservationSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validation = EquipmentReservationSchema.safeParse(rawBody);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid input payload.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { equipmentId, userName, userEmail, userType, purpose, startTime, endTime } = validation.data;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return NextResponse.json(
        { error: 'Invalid time range.' },
        { status: 400 }
      );
    }

    // 1. Future validation: Ensure startTime is at least 15 minutes in the future
    const minFutureTime = Date.now() + 15 * 60 * 1000;
    if (start.getTime() < minFutureTime) {
      return NextResponse.json(
        { error: 'Reservation start time must be at least 15 minutes in the future.' },
        { status: 400 }
      );
    }

    // 2. Duration check: Enforce duration between 30 minutes and 24 hours
    const durationMs = end.getTime() - start.getTime();
    const minDurationMs = 30 * 60 * 1000; // 30 minutes
    const maxDurationMs = 24 * 60 * 60 * 1000; // 24 hours
    if (durationMs < minDurationMs || durationMs > maxDurationMs) {
      return NextResponse.json(
        { error: 'Reservation duration must be between 30 minutes and 24 hours.' },
        { status: 400 }
      );
    }

    // 3. User pending limits: Maximum of 3 pending requests
    const pendingCount = await prisma.equipmentReservation.count({
      where: {
        userEmail,
        status: 'pending'
      }
    });
    if (pendingCount >= 3) {
      return NextResponse.json(
        { error: 'You have reached the maximum limit of 3 active pending reservation requests.' },
        { status: 400 }
      );
    }

    // 4. Equipment verification & status check
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId }
    });
    if (!equipment) {
      return NextResponse.json(
        { error: 'Specified equipment not found.' },
        { status: 404 }
      );
    }
    if (equipment.status !== 'available') {
      return NextResponse.json(
        { error: `This equipment is currently ${equipment.status} and cannot be booked.` },
        { status: 400 }
      );
    }

    // 5. Conflict detection: Check for overlapping approved reservations
    const conflicts = await prisma.equipmentReservation.findFirst({
      where: {
        equipmentId,
        status: 'approved',
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } }
        ]
      }
    });

    if (conflicts) {
      return NextResponse.json(
        { error: 'This equipment unit is already booked during the selected time interval.' },
        { status: 409 }
      );
    }

    // 6. Create the pending reservation
    const newReservation = await prisma.equipmentReservation.create({
      data: {
        equipmentId,
        userName,
        userEmail,
        userType,
        purpose,
        startTime: start,
        endTime: end,
        status: 'pending'
      }
    });

    return NextResponse.json(newReservation, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/labs/reservations:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation request.' },
      { status: 500 }
    );
  }
}

// GET all reservations (helpful for supervisor lists)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';

    const list = await prisma.equipmentReservation.findMany({
      where: status ? { status } : {},
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            lab: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/labs/reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations.' },
      { status: 500 }
    );
  }
}
