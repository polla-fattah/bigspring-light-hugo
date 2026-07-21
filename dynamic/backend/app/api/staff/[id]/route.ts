import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const detail = await prisma.staff.findUnique({
      where: { id },
      include: {
        unit: {
          select: {
            id: true,
            title: true
          }
        },
        projects: {
          where: { draft: false, visibility: 'public' },
          select: {
            id: true,
            title: true,
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
        supervisedPublications: {
          where: { draft: false },
          select: {
            id: true,
            title: true,
            pubType: true,
            year: true
          }
        }
      }
    });

    if (!detail) {
      return NextResponse.json({ error: 'Researcher profile not found.' }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (error: any) {
    console.error(`API Error in /api/staff/${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch researcher profile details.' }, { status: 500 });
  }
}
