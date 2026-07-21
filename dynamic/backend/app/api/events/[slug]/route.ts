import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const detail = await prisma.event.findUnique({
      where: { slug }
    });

    if (!detail || detail.draft) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (error: any) {
    console.error(`API Error in /api/events/${slug}:`, error);
    return NextResponse.json({ error: 'Failed to fetch event details.' }, { status: 500 });
  }
}
