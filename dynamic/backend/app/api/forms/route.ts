import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDraft = searchParams.get('includeDraft') === 'true';

    const list = await prisma.form.findMany({
      where: includeDraft ? {} : { draft: false },
      orderBy: { category: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/forms:', error);
    return NextResponse.json({ error: 'Failed to fetch template forms.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, category, subCategory, formType, description, fileUrl, filePath, fileFormat, fileSize, draft } = await request.json();
    const finalFilePath = fileUrl || filePath;

    if (!title || !category || !finalFilePath) {
      return NextResponse.json({ error: 'Title, category, and file URL/path are required.' }, { status: 400 });
    }

    const newForm = await prisma.form.create({
      data: {
        title,
        category,
        subCategory: subCategory || null,
        formType: formType || null,
        description: description || null,
        filePath: finalFilePath,
        fileFormat: fileFormat || 'PDF',
        fileSize: fileSize || null,
        draft: draft ?? false
      }
    });

    return NextResponse.json(newForm, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/forms:', error);
    return NextResponse.json({ error: 'Failed to create form template.' }, { status: 500 });
  }
}
