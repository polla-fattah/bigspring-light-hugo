import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET() {
  try {
    const list = await prisma.lab.findMany({
      where: { draft: false },
      include: {
        supervisor: {
          select: {
            id: true,
            title: true,
            email: true
          }
        },
        equipment: true
      },
      orderBy: { title: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/labs:', error);
    return NextResponse.json({ error: 'Failed to fetch laboratories.' }, { status: 500 });
  }
}
