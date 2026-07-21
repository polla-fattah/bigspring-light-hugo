import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Normalized result item schema
interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'staff' | 'project' | 'publication' | 'lab' | 'equipment' | 'event' | 'dataset';
  url: string;
  tags?: string[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const typeFilter = searchParams.get('type') || 'all';
  const unitFilter = searchParams.get('unitId') || '';

  const results: SearchResult[] = [];

  try {
    console.log('Querying from PostgreSQL Database...');

    // 1. Staff Search
    if (typeFilter === 'all' || typeFilter === 'staff') {
      const staffList = await prisma.staff.findMany({
        where: {
          draft: false,
          AND: [
            unitFilter ? { unitId: unitFilter } : {},
            q ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { subtitle: { contains: q, mode: 'insensitive' } },
                { bio: { contains: q, mode: 'insensitive' } },
                { titlePosition: { contains: q, mode: 'insensitive' } },
                { researchAreas: { hasSome: [q] } } // Exact search inside array
              ]
            } : {}
          ]
        },
        take: 20
      });

      staffList.forEach(item => {
        results.push({
          id: item.id,
          title: item.title,
          description: item.subtitle || item.titlePosition || '',
          type: 'staff',
          url: `/staff/${item.id}`,
          tags: item.researchAreas
        });
      });
    }

    // 2. Projects Search
    if (typeFilter === 'all' || typeFilter === 'projects') {
      const projectList = await prisma.project.findMany({
        where: {
          draft: false,
          visibility: 'public',
          AND: [
            unitFilter ? { unitId: unitFilter } : {},
            q ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } }
              ]
            } : {}
          ]
        },
        take: 20
      });

      projectList.forEach(item => {
        results.push({
          id: item.id,
          title: item.title,
          description: item.description || '',
          type: 'project',
          url: `/projects/${item.id}`,
          tags: item.projectType ? [item.projectType] : []
        });
      });
    }

    // 3. Publications Search
    if (typeFilter === 'all' || typeFilter === 'publications') {
      const pubList = await prisma.publication.findMany({
        where: {
          draft: false,
          AND: [
            unitFilter ? { unitId: unitFilter } : {},
            q ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { journal: { contains: q, mode: 'insensitive' } }
              ]
            } : {}
          ]
        },
        take: 20
      });

      pubList.forEach(item => {
        results.push({
          id: item.id,
          title: item.title,
          description: item.description || item.journal || '',
          type: 'publication',
          url: `/publications/${item.id}`,
          tags: item.pubType ? [item.pubType] : []
        });
      });
    }

    // 4. Labs Search
    if (typeFilter === 'all' || typeFilter === 'labs') {
      const labList = await prisma.lab.findMany({
        where: {
          draft: false,
          AND: [
            q ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { shortName: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { locationName: { contains: q, mode: 'insensitive' } },
                { departmentName: { contains: q, mode: 'insensitive' } }
              ]
            } : {}
          ]
        },
        take: 20
      });

      labList.forEach(item => {
        results.push({
          id: item.id,
          title: item.title,
          description: item.description || item.locationName || '',
          type: 'lab',
          url: `/labs/${item.id}`,
          tags: item.category ? [item.category] : []
        });
      });
    }

    // 5. Equipment Search
    if (typeFilter === 'all' || typeFilter === 'equipment') {
      const eqList = await prisma.equipment.findMany({
        where: {
          AND: [
            q ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { model: { contains: q, mode: 'insensitive' } }
              ]
            } : {}
          ]
        },
        take: 20
      });

      eqList.forEach(item => {
        results.push({
          id: item.id,
          title: item.name,
          description: item.description || item.model || '',
          type: 'equipment',
          url: `/labs#equipment-${item.id}`,
          tags: item.category ? [item.category] : []
        });
      });
    }

    // 6. Datasets Search
    if (typeFilter === 'all' || typeFilter === 'datasets') {
      const datasetList = await prisma.dataset.findMany({
        where: {
          draft: false,
          AND: [
            unitFilter ? { unitId: unitFilter } : {},
            q ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } }
              ]
            } : {}
          ]
        },
        take: 20
      });

      datasetList.forEach(item => {
        results.push({
          id: item.id,
          title: item.title,
          description: item.description || '',
          type: 'dataset',
          url: `/datasets/${item.id}`,
          tags: item.format ? [item.format] : []
        });
      });
    }

    // 7. Events Search
    if (typeFilter === 'all' || typeFilter === 'events') {
      const eventList = await prisma.event.findMany({
        where: {
          draft: false,
          AND: [
            q ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { content: { contains: q, mode: 'insensitive' } }
              ]
            } : {}
          ]
        },
        take: 20
      });

      eventList.forEach(item => {
        results.push({
          id: String(item.id),
          title: item.title,
          description: item.description || '',
          type: 'event',
          url: `/events/${item.slug}`,
          tags: item.category ? [item.category] : []
        });
      });
    }

    return NextResponse.json({
      query: q,
      type: typeFilter,
      unitId: unitFilter || null,
      source: 'database',
      count: results.length,
      results
    });

  } catch (dbError: any) {
    console.error('Database connection failed:', dbError);
    return NextResponse.json({
      query: q,
      error: 'Database connection failed. Search requires an active PostgreSQL database.',
      details: dbError.message || dbError,
      results: []
    }, { status: 500 });
  }
}
