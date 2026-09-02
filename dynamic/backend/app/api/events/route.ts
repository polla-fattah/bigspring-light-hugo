import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get('featured') === 'true';
  const includeDraft = searchParams.get('includeDraft') === 'true';

  try {
    const list = await prisma.event.findMany({
      where: {
        ...(includeDraft ? {} : { draft: false }),
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

export async function POST(request: NextRequest) {
  try {
    const { title, slug, eventDate, image, galleryImages, category, description, content, location, eventTime, draft, featured } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Event title is required.' }, { status: 400 });
    }

    const generatedSlug = slug 
      ? slug.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]/g, '')
      : title.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]/g, '').slice(0, 60) + '-' + Date.now();

    const newEvent = await prisma.event.create({
      data: {
        title,
        slug: generatedSlug,
        eventDate: eventDate ? new Date(eventDate) : new Date(),
        image: image || null,
        galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
        category: category || 'Seminar',
        description: description || null,
        content: content || null,
        location: location || 'Salahaddin University-Erbil Research Center',
        eventTime: eventTime || '10:00 AM - 01:00 PM',
        draft: draft ?? false,
        featured: featured ?? false
      }
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    console.error('API Error in POST /api/events:', error);
    return NextResponse.json({ error: 'Failed to create research event.' }, { status: 500 });
  }
}
