import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


import { EquipmentFeedbackSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const validation = EquipmentFeedbackSchema.safeParse({
      ...rawBody,
      rating: typeof rawBody.rating === 'string' ? parseInt(rawBody.rating, 10) : rawBody.rating
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid feedback payload.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { reservationId, equipmentId, userName, userEmail, rating, benefitStatement } = validation.data;

    const newFeedback = await prisma.equipmentFeedback.create({
      data: {
        reservationId: reservationId || null,
        equipmentId,
        userName,
        userEmail,
        rating,
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
