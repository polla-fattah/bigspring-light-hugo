import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  try {
    const list = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        staff: {
          select: {
            id: true
          }
        }
      },
      orderBy: { email: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/users:', error);
    return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
  }
}
