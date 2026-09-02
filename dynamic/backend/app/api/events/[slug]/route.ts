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

    if (!detail) {
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
    console.error(`API Error in GET /api/events/${slug}:`, error);
    return NextResponse.json({ error: 'Failed to fetch event details.' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const data = await request.json();

    const updated = await prisma.event.update({
      where: { slug },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.image !== undefined ? { image: data.image } : {}),
        ...(data.galleryImages !== undefined ? { galleryImages: data.galleryImages } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.content !== undefined ? { content: data.content } : {}),
        ...(data.location !== undefined ? { location: data.location } : {}),
        ...(data.eventTime !== undefined ? { eventTime: data.eventTime } : {}),
        ...(data.draft !== undefined ? { draft: data.draft } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {})
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`API Error in PUT /api/events/${slug}:`, error);
    return NextResponse.json({ error: 'Failed to update event.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    await prisma.event.delete({
      where: { slug }
    });
    return NextResponse.json({ success: true, message: 'Event deleted.' });
  } catch (error: any) {
    console.error(`API Error in DELETE /api/events/${slug}:`, error);
    return NextResponse.json({ error: 'Failed to delete event.' }, { status: 500 });
  }
}
