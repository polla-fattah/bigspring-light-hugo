import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
  try {
    const { entityType, entityId, draft } = await request.json();

    if (!entityType || entityId === undefined || draft === undefined) {
      return NextResponse.json(
        { error: 'Missing required moderation toggle parameters.' },
        { status: 400 }
      );
    }

    const isDraft = !!draft;

    let updated: any = null;

    switch (entityType) {
      case 'publication':
        updated = await prisma.publication.update({
          where: { id: String(entityId) },
          data: { draft: isDraft }
        });
        break;
      case 'project':
        updated = await prisma.project.update({
          where: { id: String(entityId) },
          data: { draft: isDraft }
        });
        break;
      case 'staff':
        updated = await prisma.staff.update({
          where: { id: String(entityId) },
          data: { draft: isDraft }
        });
        break;
      case 'unit':
        updated = await prisma.researchUnit.update({
          where: { id: String(entityId) },
          data: { draft: isDraft }
        });
        break;
      case 'event':
        updated = await prisma.event.update({
          where: { id: Number(entityId) },
          data: { draft: isDraft }
        });
        break;
      case 'dataset':
        updated = await prisma.dataset.update({
          where: { id: String(entityId) },
          data: { draft: isDraft }
        });
        break;
      case 'regulation':
        updated = await prisma.regulation.update({
          where: { id: Number(entityId) },
          data: { draft: isDraft }
        });
        break;
      case 'form':
        updated = await prisma.form.update({
          where: { id: Number(entityId) },
          data: { draft: isDraft }
        });
        break;
      case 'testimonial':
        updated = await prisma.testimonial.update({
          where: { id: String(entityId) },
          data: { draft: isDraft }
        });
        break;
      default:
        return NextResponse.json({ error: 'Unsupported entity type for moderation.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error('API Error in PATCH /api/content/publish:', error);
    return NextResponse.json(
      { error: 'Failed to update content draft status.', details: error.message || error },
      { status: 500 }
    );
  }
}

// GET all drafts (useful for superadmin queue layout list)
export async function GET(request: NextRequest) {
  try {
    const publications = await prisma.publication.findMany({ where: { draft: true } });
    const projects = await prisma.project.findMany({ where: { draft: true } });
    const staff = await prisma.staff.findMany({ where: { draft: true } });
    const units = await prisma.researchUnit.findMany({ where: { draft: true } });
    const datasets = await prisma.dataset.findMany({ where: { draft: true } });
    const events = await prisma.event.findMany({ where: { draft: true } });
    const testimonials = await prisma.testimonial.findMany({ where: { draft: true } });

    const draftsQueue = [
      ...publications.map(p => ({ id: p.id, title: p.title, type: 'publication', info: p.pubType })),
      ...projects.map(p => ({ id: p.id, title: p.title, type: 'project', info: p.status })),
      ...staff.map(s => ({ id: s.id, title: s.title, type: 'staff', info: s.subtitle })),
      ...units.map(u => ({ id: u.id, title: u.title, type: 'unit', info: u.name })),
      ...datasets.map(d => ({ id: d.id, title: d.title, type: 'dataset', info: d.format })),
      ...events.map(e => ({ id: String(e.id), title: e.title, type: 'event', info: e.category })),
      ...testimonials.map(t => ({ id: t.id, title: t.title, type: 'testimonial', info: t.position }))
    ];

    return NextResponse.json(draftsQueue);
  } catch (error: any) {
    console.error('API Error in GET /api/content/publish:', error);
    return NextResponse.json({ error: 'Failed to fetch content draft queue.' }, { status: 500 });
  }
}
