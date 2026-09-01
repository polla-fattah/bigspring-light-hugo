import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get('featured') === 'true';

  try {
    const list = await prisma.event.findMany({
      where: {
        draft: false,
        ...(featuredOnly ? { featured: true } : {})
      },
      orderBy: { eventDate: 'desc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/events:', error);
    return NextResponse.json({ error: 'Failed to fetch events list.' }, { status: 500 });
  }
}
