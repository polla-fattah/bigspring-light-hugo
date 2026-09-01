import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get('featured') === 'true';

  try {
    const list = await prisma.event.findMany({
      where: {
        draft: false,
        slug: { not: '_index' },
        ...(featuredOnly ? { featured: true } : {})
      },
      orderBy: { eventDate: 'desc' }
    });

    const formatted = list.map(item => ({
      ...item,
      image: item.image 
        ? (item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/${item.image}`)
        : null,
      galleryImages: Array.isArray(item.galleryImages)
        ? item.galleryImages.map(img => img.startsWith('/') || img.startsWith('http') ? img : `/${img}`)
        : []
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error('API Error in /api/events:', error);
    return NextResponse.json({ error: 'Failed to fetch events list.' }, { status: 500 });
  }
}
