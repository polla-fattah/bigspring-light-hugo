import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const list = await prisma.testimonial.findMany({
      where: { draft: false },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials.' }, { status: 500 });
  }
}
