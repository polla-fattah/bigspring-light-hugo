import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDraft = searchParams.get('includeDraft') === 'true';

    const list = await prisma.regulation.findMany({
      where: includeDraft ? {} : { draft: false },
      orderBy: { category: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/regulations:', error);
    return NextResponse.json({ error: 'Failed to fetch regulations.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, category, description, fileUrl, filePath, draft } = await request.json();
    const finalFilePath = fileUrl || filePath;

    if (!title || !category || !finalFilePath) {
      return NextResponse.json({ error: 'Title, category, and file URL/path are required.' }, { status: 400 });
    }

    const newRegulation = await prisma.regulation.create({
      data: {
        title,
        category,
        description: description || null,
        filePath: finalFilePath,
        draft: draft ?? false
      }
    });

    return NextResponse.json(newRegulation, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/regulations:', error);
    return NextResponse.json({ error: 'Failed to create regulation policy.' }, { status: 500 });
  }
}
