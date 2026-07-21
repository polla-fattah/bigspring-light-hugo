import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pubType = searchParams.get('pubType') || '';
  const unitId = searchParams.get('unitId') || '';

  try {
    const list = await prisma.publication.findMany({
      where: {
        draft: false,
        ...(pubType ? { pubType } : {}),
        ...(unitId ? { unitId } : {})
      },
      include: {
        unit: {
          select: {
            id: true,
            title: true
          }
        },
        authors: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { year: 'desc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/publications:', error);
    return NextResponse.json({ error: 'Failed to fetch publications list.' }, { status: 500 });
  }
}
