import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reservationId = parseInt(id, 10);

  if (isNaN(reservationId)) {
    return NextResponse.json({ error: 'Invalid reservation ID.' }, { status: 400 });
  }

  try {
    const { status, rejectionReason, approvedById } = await request.json();

    if (!status || !['approved', 'rejected', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid or missing status parameter.' }, { status: 400 });
    }

    // Retrieve the existing reservation
    const reservation = await prisma.equipmentReservation.findUnique({
      where: { id: reservationId }
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found.' }, { status: 404 });
    }

    // Update reservation status
    const updated = await prisma.equipmentReservation.update({
      where: { id: reservationId },
      data: {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason || null : null,
        approvedById: status === 'approved' ? approvedById || null : null
      }
    });

    // If approved, check if we should update equipment availability (e.g. status)
    if (status === 'approved') {
      await prisma.equipment.update({
        where: { id: reservation.equipmentId },
        data: { status: 'in-use' }
      });
    } else if (status === 'completed' || status === 'rejected') {
      await prisma.equipment.update({
        where: { id: reservation.equipmentId },
        data: { status: 'available' }
      });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`API Error in PATCH /api/labs/reservations/${id}:`, error);
    return NextResponse.json({ error: 'Failed to update reservation status.' }, { status: 500 });
  }
}
