import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid regulation ID.' }, { status: 400 });
    }

    const data = await request.json();
    const finalFilePath = data.fileUrl || data.filePath;

    const updatedRegulation = await prisma.regulation.update({
      where: { id: numericId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.category ? { category: data.category } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(finalFilePath ? { filePath: finalFilePath } : {}),
        ...(data.draft !== undefined ? { draft: data.draft } : {})
      }
    });

    return NextResponse.json(updatedRegulation);
  } catch (error: any) {
    console.error('API Error in PUT /api/regulations/[id]:', error);
    return NextResponse.json({ error: 'Failed to update regulation policy.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid regulation ID.' }, { status: 400 });
    }

    await prisma.regulation.delete({ where: { id: numericId } });
    return NextResponse.json({ message: 'Regulation policy deleted successfully.' });
  } catch (error: any) {
    console.error('API Error in DELETE /api/regulations/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete regulation policy.' }, { status: 500 });
  }
}
