import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const existing = await prisma.publication.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Publication not found.' }, { status: 404 });
    }

    const updated = await prisma.publication.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        pubType: body.pubType !== undefined ? body.pubType : undefined,
        degree: body.degree !== undefined ? body.degree : undefined,
        year: body.year !== undefined ? body.year : undefined,
        journal: body.journal !== undefined ? body.journal : undefined,
        pdf: body.pdf !== undefined ? body.pdf : (body.link !== undefined ? body.link : undefined),
        description: body.description !== undefined ? body.description : undefined,
        unitId: body.unitId !== undefined ? body.unitId : undefined,
        draft: body.draft !== undefined ? body.draft : undefined
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`API Error in PUT /api/publications/${id}:`, error);
    return NextResponse.json({ error: 'Failed to update publication.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const existing = await prisma.publication.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Publication not found.' }, { status: 404 });
    }
    await prisma.publication.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Publication deleted successfully.' });
  } catch (error: any) {
    console.error(`API Error in DELETE /api/publications/${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete publication.' }, { status: 500 });
  }
}
