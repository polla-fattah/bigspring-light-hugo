import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pubType = searchParams.get('pubType') || '';
  const unitId = searchParams.get('unitId') || '';

  try {
    const list = await prisma.publication.findMany({
      where: {
        draft: false,
        ...(pubType ? { pubType } : {}),
        ...(unitId ? { unitId } : {})
      },
      include: {
        unit: {
          select: {
            id: true,
            title: true
          }
        },
        authors: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { year: 'desc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/publications:', error);
    return NextResponse.json({ error: 'Failed to fetch publications list.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, pubType, degree, year, unitId, description, pdf, journal, creatorStaffId } = body;

    if (!title || !pubType || !creatorStaffId) {
      return NextResponse.json({ error: 'Title, publication type, and creator are required.' }, { status: 400 });
    }

    // Generate unique ID based on title
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    const id = `pub-${cleanTitle}-${Date.now().toString().slice(-4)}`;

    const newPublication = await prisma.publication.create({
      data: {
        id,
        title,
        pubType,
        degree: degree || null,
        year: year || null,
        unitId: unitId || null,
        description: description || null,
        pdf: pdf || null,
        journal: journal || null,
        draft: true, // Saved as draft
        authors: {
          connect: { id: creatorStaffId }
        }
      }
    });

    return NextResponse.json(newPublication, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/publications:', error);
    return NextResponse.json({ error: 'Failed to create publication draft.' }, { status: 500 });
  }
}
