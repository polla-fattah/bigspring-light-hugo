import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const list = await prisma.researchUnit.findMany({
      where: { draft: false },
      orderBy: { title: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/units:', error);
    return NextResponse.json({ error: 'Failed to fetch research units.' }, { status: 500 });
  }
}
