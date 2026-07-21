import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const list = await prisma.dataset.findMany({
      where: { draft: false },
      include: {
        unit: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/datasets:', error);
    return NextResponse.json({ error: 'Failed to fetch datasets.' }, { status: 500 });
  }
}
