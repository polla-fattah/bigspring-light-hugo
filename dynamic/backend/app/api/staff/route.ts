import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const unitId = searchParams.get('unitId') || '';

  try {
    const list = await prisma.staff.findMany({
      where: {
        draft: false,
        ...(unitId ? { unitId } : {})
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        image: true,
        titlePosition: true,
        email: true,
        researchAreas: true,
        unit: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { title: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/staff:', error);
    return NextResponse.json({ error: 'Failed to fetch researchers list.' }, { status: 500 });
  }
}
