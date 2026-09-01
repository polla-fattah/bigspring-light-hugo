import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDraft = searchParams.get('includeDraft') === 'true';

    const list = await prisma.lab.findMany({
      where: includeDraft ? {} : { draft: false },
      include: {
        supervisor: {
          select: {
            id: true,
            title: true,
            email: true
          }
        },
        equipment: true
      },
      orderBy: { title: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/labs:', error);
    return NextResponse.json({ error: 'Failed to fetch laboratories.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, title, name, description, image, platforms, supervisorId, draft } = await request.json();

    if (!id || !title) {
      return NextResponse.json({ error: 'Lab ID and title are required.' }, { status: 400 });
    }

    const newLab = await prisma.lab.create({
      data: {
        id,
        title,
        description: description || null,
        image: image || null,
        platforms: platforms || [],
        supervisorId: supervisorId || null,
        draft: draft ?? false
      }
    });

    return NextResponse.json(newLab, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/labs:', error);
    return NextResponse.json({ error: 'Failed to create core laboratory.' }, { status: 500 });
  }
}
