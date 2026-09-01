import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const feedbackId = parseInt(id, 10);
    if (isNaN(feedbackId)) {
      return NextResponse.json({ error: 'Invalid feedback ID.' }, { status: 400 });
    }

    const { status } = await request.json(); // 'approved', 'rejected'
    if (!['approved', 'rejected', 'pending_review'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value.' }, { status: 400 });
    }

    const updated = await prisma.equipmentFeedback.update({
      where: { id: feedbackId },
      data: { status }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`API Error in PATCH /api/labs/feedback/${id}:`, error);
    return NextResponse.json({ error: 'Failed to update feedback status.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const feedbackId = parseInt(id, 10);
    if (isNaN(feedbackId)) {
      return NextResponse.json({ error: 'Invalid feedback ID.' }, { status: 400 });
    }

    await prisma.equipmentFeedback.delete({
      where: { id: feedbackId }
    });

    return NextResponse.json({ message: 'Feedback record deleted.' });
  } catch (error: any) {
    console.error(`API Error in DELETE /api/labs/feedback/${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete feedback record.' }, { status: 500 });
  }
}
