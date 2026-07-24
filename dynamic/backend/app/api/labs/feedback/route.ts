import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { reservationId, equipmentId, userName, userEmail, rating, benefitStatement } = await request.json();

    if (!equipmentId || !userName || !userEmail || !rating || !benefitStatement) {
      return NextResponse.json(
        { error: 'Missing required feedback fields.' },
        { status: 400 }
      );
    }

    const ratingInt = parseInt(rating, 10);
    if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5.' },
        { status: 400 }
      );
    }

    const parsedReservationId = reservationId ? parseInt(reservationId, 10) : null;

    const newFeedback = await prisma.equipmentFeedback.create({
      data: {
        reservationId: parsedReservationId && !isNaN(parsedReservationId) ? parsedReservationId : null,
        equipmentId,
        userName,
        userEmail,
        rating: ratingInt,
        benefitStatement,
        status: 'pending_review' // Superadmin reviews this before making public
      }
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/labs/feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit equipment feedback.' },
      { status: 500 }
    );
  }
}

// GET all feedbacks (moderated or all for dashboard review)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || ''; // 'approved', 'pending_review'
    const equipmentId = searchParams.get('equipmentId') || '';

    const list = await prisma.equipmentFeedback.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(equipmentId ? { equipmentId } : {})
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/labs/feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment feedbacks.' },
      { status: 500 }
    );
  }
}
