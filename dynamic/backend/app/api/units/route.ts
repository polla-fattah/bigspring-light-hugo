import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDraft = searchParams.get('includeDraft') === 'true';

    const list = await prisma.researchUnit.findMany({
      where: includeDraft ? {} : { draft: false },
      orderBy: { title: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/units:', error);
    return NextResponse.json({ error: 'Failed to fetch research units.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, title, name, description, image, draft } = await request.json();

    if (!id || !title) {
      return NextResponse.json({ error: 'Unit ID and title are required.' }, { status: 400 });
    }

    const newUnit = await prisma.researchUnit.create({
      data: {
        id,
        title,
        name: name || title,
        description: description || null,
        image: image || null,
        draft: draft ?? false
      }
    });

    return NextResponse.json(newUnit, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/units:', error);
    return NextResponse.json({ error: 'Failed to create research unit.' }, { status: 500 });
  }
}
