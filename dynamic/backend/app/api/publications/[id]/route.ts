import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const detail = await prisma.publication.findUnique({
      where: { id },
      include: {
        unit: {
          select: {
            id: true,
            title: true
          }
        },
        authors: {
          where: { draft: false },
          select: {
            id: true,
            title: true,
            subtitle: true,
            image: true
          }
        },
        supervisor: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!detail) {
      return NextResponse.json({ error: 'Publication not found.' }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (error: any) {
    console.error(`API Error in /api/publications/${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch publication details.' }, { status: 500 });
  }
}
