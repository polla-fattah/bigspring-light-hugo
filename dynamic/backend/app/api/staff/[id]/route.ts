import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const detail = await prisma.staff.findUnique({
      where: { id },
      include: {
        unit: {
          select: {
            id: true,
            title: true
          }
        },
        projects: {
          where: { draft: false, visibility: 'public' },
          select: {
            id: true,
            title: true,
            status: true,
            projectType: true
          }
        },
        publications: {
          where: { draft: false },
          select: {
            id: true,
            title: true,
            pubType: true,
            year: true,
            journal: true
          }
        },
        supervisedPublications: {
          where: { draft: false },
          select: {
            id: true,
            title: true,
            pubType: true,
            year: true
          }
        }
      }
    });

    if (!detail) {
      return NextResponse.json({ error: 'Researcher profile not found.' }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (error: any) {
    console.error(`API Error in /api/staff/${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch researcher profile details.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    // Check if staff profile exists
    const staff = await prisma.staff.findUnique({
      where: { id }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Researcher profile not found.' }, { status: 404 });
    }

    // Perform database updates
    const updated = await prisma.staff.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        subtitle: body.subtitle !== undefined ? body.subtitle : undefined,
        image: body.image !== undefined ? body.image : undefined,
        titlePosition: body.titlePosition !== undefined ? body.titlePosition : undefined,
        email: body.email !== undefined ? body.email : undefined,
        orcid: body.orcid !== undefined ? body.orcid : undefined,
        googleScholar: body.googleScholar !== undefined ? body.googleScholar : undefined,
        scopus: body.scopus !== undefined ? body.scopus : undefined,
        researchgate: body.researchgate !== undefined ? body.researchgate : undefined,
        personalWebsite: body.personalWebsite !== undefined ? body.personalWebsite : undefined,
        bio: body.bio !== undefined ? body.bio : undefined,
        description: body.description !== undefined ? body.description : undefined,
        researchAreas: Array.isArray(body.researchAreas) ? body.researchAreas : undefined
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`API Error in PUT /api/staff/${id}:`, error);
    return NextResponse.json({ error: 'Failed to update researcher profile details.' }, { status: 500 });
  }
}
