import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const detail = await prisma.project.findUnique({
      where: { id },
      include: {
        unit: {
          select: {
            id: true,
            title: true
          }
        },
        team: {
          where: { draft: false },
          select: {
            id: true,
            title: true,
            subtitle: true,
            image: true,
            titlePosition: true,
            email: true
          }
        },
        discussionMessages: {
          include: {
            sender: {
              select: {
                id: true,
                title: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!detail) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    return NextResponse.json(detail);
  } catch (error: any) {
    console.error(`API Error in /api/projects/${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch project details.' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  try {
    const { senderId, message } = await request.json();

    if (!senderId || !message) {
      return NextResponse.json(
        { error: 'Sender ID and message content are required.' },
        { status: 400 }
      );
    }

    // Verify staff member exists
    const staffExists = await prisma.staff.findUnique({
      where: { id: senderId }
    });

    if (!staffExists) {
      return NextResponse.json(
        { error: 'Sender profile not found in SUE researchers database.' },
        { status: 404 }
      );
    }

    // Create message
    const newMessage = await prisma.projectDiscussionMessage.create({
      data: {
        projectId,
        senderId,
        message
      },
      include: {
        sender: {
          select: {
            id: true,
            title: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    console.error(`API Error in POST /api/projects/${projectId}:`, error);
    return NextResponse.json(
      { error: 'Failed to post project discussion message.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        name: body.title !== undefined ? body.title : undefined,
        description: body.description !== undefined ? body.description : undefined,
        status: body.status !== undefined ? body.status : undefined,
        unitId: body.unitId !== undefined ? body.unitId : undefined,
        year: body.year !== undefined ? body.year : undefined,
        projectType: body.projectType !== undefined ? body.projectType : undefined,
        draft: body.draft !== undefined ? body.draft : undefined,
        visibility: body.visibility !== undefined ? body.visibility : undefined
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`API Error in PUT /api/projects/${id}:`, error);
    return NextResponse.json({ error: 'Failed to update project.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error: any) {
    console.error(`API Error in DELETE /api/projects/${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
  }
}
