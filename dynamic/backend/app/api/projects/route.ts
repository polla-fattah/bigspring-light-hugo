import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || '';
  const unitId = searchParams.get('unitId') || '';

  try {
    const list = await prisma.project.findMany({
      where: {
        draft: false,
        ...(status ? { status } : {}),
        ...(unitId ? { unitId } : {})
      },
      include: {
        unit: {
          select: {
            id: true,
            title: true
          }
        },
        team: {
          select: {
            id: true,
            title: true,
            image: true
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('API Error in /api/projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects list.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, status, unitId, year, projectType, creatorStaffId } = body;

    if (!title || !status || !creatorStaffId) {
      return NextResponse.json({ error: 'Title, status, and creator are required.' }, { status: 400 });
    }

    // Generate unique ID based on title
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if project already exists
    const exists = await prisma.project.findUnique({ where: { id } });
    const finalId = exists ? `${id}-${Date.now().toString().slice(-4)}` : id;

    const newProject = await prisma.project.create({
      data: {
        id: finalId,
        title,
        name: title,
        description: description || null,
        status,
        visibility: 'public', // default public once approved
        unitId: unitId || null,
        year: year || null,
        projectType: projectType || null,
        draft: true, // Saved as draft
        team: {
          connect: { id: creatorStaffId }
        }
      }
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/projects:', error);
    return NextResponse.json({ error: 'Failed to create project draft.' }, { status: 500 });
  }
}
