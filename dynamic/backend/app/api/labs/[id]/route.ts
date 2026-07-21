import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const detail = await prisma.lab.findUnique({
      where: { id },
      include: {
        supervisor: {
          select: {
            id: true,
            title: true,
            email: true,
            image: true
          }
        },
        equipment: {
          include: {
            reservations: {
              orderBy: { startTime: 'desc' },
              take: 10
            }
          }
        }
      }
    });

    if (!detail) {
      return NextResponse.json({ error: 'Laboratory not found.' }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (error: any) {
    console.error(`API Error in /api/labs/${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch laboratory details.' }, { status: 500 });
  }
}
