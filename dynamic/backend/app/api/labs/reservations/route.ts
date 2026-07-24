import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { equipmentId, userName, userEmail, userType, purpose, startTime, endTime } = await request.json();

    if (!equipmentId || !userName || !userEmail || !userType || !purpose || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return NextResponse.json(
        { error: 'Invalid time range.' },
        { status: 400 }
      );
    }

    // 1. Conflict detection algorithm:
    // Check if there are overlapping approved reservations for the same equipment
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

    // 2. Create the pending reservation
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
