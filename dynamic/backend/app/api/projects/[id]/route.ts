import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
