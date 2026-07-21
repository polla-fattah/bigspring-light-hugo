import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || '';
  const unitId = searchParams.get('unitId') || '';

  try {
    const list = await prisma.project.findMany({
      where: {
        draft: false,
        visibility: 'public',
        ...(status ? { status } : {}),
        ...(unitId ? { unitId } : {})
      },
      include: {
        unit: {
          select: {
            id: true,
            title: true
          }
        },
        team: {
          select: {
            id: true,
            title: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects list.' }, { status: 500 });
  }
}
