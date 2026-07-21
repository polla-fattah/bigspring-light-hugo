import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const list = await prisma.regulation.findMany({
      where: { draft: false },
      orderBy: { category: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/regulations:', error);
    return NextResponse.json({ error: 'Failed to fetch regulations.' }, { status: 500 });
  }
}
