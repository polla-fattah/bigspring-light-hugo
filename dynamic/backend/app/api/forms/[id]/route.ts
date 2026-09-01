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
      return NextResponse.json({ error: 'Invalid form ID.' }, { status: 400 });
    }

    const data = await request.json();
    const finalFilePath = data.fileUrl || data.filePath;

    const updatedForm = await prisma.form.update({
      where: { id: numericId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.category ? { category: data.category } : {}),
        ...(data.subCategory !== undefined ? { subCategory: data.subCategory } : {}),
        ...(data.formType !== undefined ? { formType: data.formType } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(finalFilePath ? { filePath: finalFilePath } : {}),
        ...(data.fileFormat !== undefined ? { fileFormat: data.fileFormat } : {}),
        ...(data.fileSize !== undefined ? { fileSize: data.fileSize } : {}),
        ...(data.draft !== undefined ? { draft: data.draft } : {})
      }
    });

    return NextResponse.json(updatedForm);
  } catch (error: any) {
    console.error('API Error in PUT /api/forms/[id]:', error);
    return NextResponse.json({ error: 'Failed to update form template.' }, { status: 500 });
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
      return NextResponse.json({ error: 'Invalid form ID.' }, { status: 400 });
    }

    await prisma.form.delete({ where: { id: numericId } });
    return NextResponse.json({ message: 'Form template deleted successfully.' });
  } catch (error: any) {
    console.error('API Error in DELETE /api/forms/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete form template.' }, { status: 500 });
  }
}
