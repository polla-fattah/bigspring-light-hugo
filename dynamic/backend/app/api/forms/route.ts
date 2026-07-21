import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const list = await prisma.form.findMany({
      where: { draft: false },
      orderBy: { category: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/forms:', error);
    return NextResponse.json({ error: 'Failed to fetch proposal template forms.' }, { status: 500 });
  }
}
