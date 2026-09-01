import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const detail = await prisma.researchUnit.findUnique({
      where: { id },
      include: {
        staff: {
          where: { draft: false },
          select: {
            id: true,
            title: true,
            subtitle: true,
            image: true,
            titlePosition: true,
            email: true,
            researchAreas: true
          }
        },
        projects: {
          where: { draft: false, visibility: 'public' },
          select: {
            id: true,
            title: true,
            name: true,
            status: true,
            projectType: true
          }
        },
        publications: {
          where: { draft: false },
          select: {
            id: true,
            title: true,
            pubType: true,
            year: true,
            journal: true
          }
        },
        datasets: {
          where: { draft: false },
          select: {
            id: true,
            title: true,
            format: true,
            access: true
          }
        }
      }
    });

    if (!detail) {
      return NextResponse.json({ error: 'Research Unit not found.' }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (error: any) {
    console.error(`API Error in /api/units/${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch research unit details.' }, { status: 500 });
  }
}
