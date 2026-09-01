import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/equipment - Fetch equipment items (optionally filter by labId or query)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const labId = searchParams.get('labId');
  const q = searchParams.get('q');

  try {
    const list = await prisma.equipment.findMany({
      where: {
        ...(labId ? { labId } : {}),
        ...(q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        } : {})
      },
      include: {
        lab: {
          select: { id: true, title: true, locationName: true, departmentName: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in GET /api/equipment:', error);
    return NextResponse.json({ error: 'Failed to fetch equipment list.' }, { status: 500 });
  }
}

// POST /api/equipment - Create new equipment profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, labId, category, description, image, status, model, specifications, totalUnits } = body;

    if (!id || !name || !labId) {
      return NextResponse.json({ error: 'Equipment ID, Name, and Lab ID are required.' }, { status: 400 });
    }

    const created = await prisma.equipment.create({
      data: {
        id: id.toLowerCase().replace(/\s+/g, '-'),
        name,
        labId,
        category: category || null,
        description: description || null,
        image: image || null,
        status: status || 'available',
        model: model || null,
        specifications: Array.isArray(specifications) ? specifications : [],
        totalUnits: totalUnits ? parseInt(totalUnits, 10) : 1,
        workingUnits: totalUnits ? parseInt(totalUnits, 10) : 1
      }
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/equipment:', error);
    return NextResponse.json({ error: 'Failed to create equipment profile.' }, { status: 500 });
  }
}
