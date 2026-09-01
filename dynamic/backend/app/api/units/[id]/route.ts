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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedUnit = await prisma.researchUnit.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.name ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.draft !== undefined ? { draft: data.draft } : {})
      }
    });

    return NextResponse.json(updatedUnit);
  } catch (error: any) {
    console.error('API Error in PUT /api/units/[id]:', error);
    return NextResponse.json({ error: 'Failed to update research unit.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.researchUnit.delete({ where: { id } });
    return NextResponse.json({ message: 'Research unit deleted successfully.' });
  } catch (error: any) {
    console.error('API Error in DELETE /api/units/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete research unit.' }, { status: 500 });
  }
}
