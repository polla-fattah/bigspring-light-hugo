import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedLab = await prisma.lab.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.platforms !== undefined ? { platforms: data.platforms } : {}),
        ...(data.supervisorId !== undefined ? { supervisorId: data.supervisorId } : {}),
        ...(data.draft !== undefined ? { draft: data.draft } : {})
      }
    });

    return NextResponse.json(updatedLab);
  } catch (error: any) {
    console.error('API Error in PUT /api/labs/[id]:', error);
    return NextResponse.json({ error: 'Failed to update laboratory.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.lab.delete({ where: { id } });
    return NextResponse.json({ message: 'Laboratory deleted successfully.' });
  } catch (error: any) {
    console.error('API Error in DELETE /api/labs/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete laboratory.' }, { status: 500 });
  }
}
