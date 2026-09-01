import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.dataset.findUnique({
      where: { id },
      include: {
        unit: true
      }
    });

    if (!item) {
      return NextResponse.json({ error: 'Dataset not found.' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('API Error in /api/datasets/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch dataset details.' }, { status: 500 });
  }
}
