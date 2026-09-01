import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const detail = await prisma.event.findUnique({
      where: { slug }
    });

    if (!detail || detail.draft) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    const formatted = {
      ...detail,
      image: detail.image 
        ? (detail.image.startsWith('/') || detail.image.startsWith('http') ? detail.image : `/${detail.image}`)
        : null,
      galleryImages: Array.isArray(detail.galleryImages)
        ? detail.galleryImages.map(img => img.startsWith('/') || img.startsWith('http') ? img : `/${img}`)
        : []
    };

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error(`API Error in /api/events/${slug}:`, error);
    return NextResponse.json({ error: 'Failed to fetch event details.' }, { status: 500 });
  }
}
