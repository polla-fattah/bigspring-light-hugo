import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { pbkdf2Sync, randomBytes } from 'crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

const prisma = new PrismaClient();

async function main() {
  console.log('Reading content_data.json...');
  const jsonPath = path.resolve(process.cwd(), '../../migration/content_data.json');
  
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at: ${jsonPath}`);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(rawData);

  // In our extraction JSON, sections is a dictionary
  const sections = data.sections || {};
  const unitsSection = sections.units || [];
  const staffSection = sections.staff || [];
  const projectsSection = sections.projects || [];
  const publicationsSection = sections.publications || [];
  const labsSection = sections.labs || [];
  const datasetsSection = sections.datasets || [];
  const testimonialsSection = sections.testimonials || [];
  const regulationsSection = sections.regulations || [];
  const templatesSection = sections.templates || [];
  const eventsSection = sections.events || [];

  console.log(`Extracted counts from JSON sections:
  - Units: ${unitsSection.length}
  - Staff: ${staffSection.length}
  - Projects: ${projectsSection.length}
  - Publications: ${publicationsSection.length}
  - Labs: ${labsSection.length}
  - Datasets: ${datasetsSection.length}
  - Testimonials: ${testimonialsSection.length}
  - Regulations: ${regulationsSection.length}
  - Templates: ${templatesSection.length}
  - Events: ${eventsSection.length}`);

  console.log('Seeding database tables...');

  // 1. Seed System Settings (Vision / Mission / Quotes)
  console.log('Seeding System Settings...');
  const defaultSettings = [
    {
      keyName: 'vision_statement',
      valueText: 'Advanced data analytics, interdisciplinary research, and technological innovation to address local and global challenges in the Kurdistan Region and beyond.'
    },
    {
      keyName: 'mission_statement',
      valueText: 'To promote excellent scientific inquiry, support academic staff at Salahaddin University-Erbil, manage specialized laboratory equipment, and publish impactful research outputs.'
    },
    {
      keyName: 'homepage_president_quote',
      valueText: 'Salahaddin University Research Center represents our dedication to scientific advancement, academic integrity, and policy-driven development.'
    }
  ];

  for (const setting of defaultSettings) {
    await prisma.systemSettings.upsert({
      where: { keyName: setting.keyName },
      update: { valueText: setting.valueText },
      create: { keyName: setting.keyName, valueText: setting.valueText }
    });
  }

  // 2. Seed Research Units
  console.log('Seeding Research Units...');
  const unitsMap = new Set<string>();
  for (const item of unitsSection) {
    const fm = item.frontmatter || {};
    if (!fm.id) continue;
    unitsMap.add(fm.id);
    await prisma.researchUnit.upsert({
      where: { id: fm.id },
      update: {
        title: fm.title || 'Untitled Unit',
        name: fm.name || 'Untitled Unit',
        image: fm.image || null,
        description: fm.description || null,
        draft: typeof fm.draft === 'boolean' ? fm.draft : false
      },
      create: {
        id: fm.id,
        title: fm.title || 'Untitled Unit',
        name: fm.name || 'Untitled Unit',
        image: fm.image || null,
        description: fm.description || null,
        draft: typeof fm.draft === 'boolean' ? fm.draft : false
      }
    });
  }

  // 3. Seed Users & Staff
  console.log('Seeding Users & Staff...');
  const staffMap = new Set<string>();
  for (const item of staffSection) {
    const fm = item.frontmatter || {};
    if (!fm.id) continue;
    staffMap.add(fm.id);

    // Create a default User account first for authentication
    const email = fm.email || `${fm.id}@su.edu.krd`;
    const name = fm.title || 'Researcher';
    
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        image: fm.image || null,
        role: 'researcher',
        passwordHash: hashPassword('password123')
      },
      create: {
        name,
        email,
        image: fm.image || null,
        role: 'researcher',
        passwordHash: hashPassword('password123')
      }
    });

    // Seed staff profile linked to user
    await prisma.staff.upsert({
      where: { id: fm.id },
      update: {
        userId: user.id,
        title: fm.title || 'Untitled Staff',
        subtitle: fm.subtitle || null,
        image: fm.image || null,
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        titlePosition: fm.title_position || null,
        email: fm.email || null,
        orcid: fm.orcid || null,
        googleScholar: fm.google_scholar || null,
        scopus: fm.scopus || null,
        researchgate: fm.researchgate || null,
        personalWebsite: fm.personal_website || null,
        bio: fm.bio || null,
        content: item.body || null,
        description: fm.description || null,
        researchAreas: Array.isArray(fm.research_areas) ? fm.research_areas : [],
        draft: typeof fm.draft === 'boolean' ? fm.draft : false
      },
      create: {
        id: fm.id,
        userId: user.id,
        title: fm.title || 'Untitled Staff',
        subtitle: fm.subtitle || null,
        image: fm.image || null,
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        titlePosition: fm.title_position || null,
        email: fm.email || null,
        orcid: fm.orcid || null,
        googleScholar: fm.google_scholar || null,
        scopus: fm.scopus || null,
        researchgate: fm.researchgate || null,
        personalWebsite: fm.personal_website || null,
        bio: fm.bio || null,
        content: item.body || null,
        description: fm.description || null,
        researchAreas: Array.isArray(fm.research_areas) ? fm.research_areas : [],
        draft: typeof fm.draft === 'boolean' ? fm.draft : false
      }
    });
  }

  // 3a. Seed Admin & Lab Staff Accounts
  console.log('Seeding Administrative Users...');
  await prisma.user.upsert({
    where: { email: 'admin@su.edu.krd' },
    update: {
      name: 'SURC Superadmin',
      role: 'superadmin',
      passwordHash: hashPassword('adminpassword')
    },
    create: {
      email: 'admin@su.edu.krd',
      name: 'SURC Superadmin',
      role: 'superadmin',
      passwordHash: hashPassword('adminpassword')
    }
  });

  await prisma.user.upsert({
    where: { email: 'lab_staff@su.edu.krd' },
    update: {
      name: 'SURC Lab Staff',
      role: 'lab_staff',
      passwordHash: hashPassword('labpassword')
    },
    create: {
      email: 'lab_staff@su.edu.krd',
      name: 'SURC Lab Staff',
      role: 'lab_staff',
      passwordHash: hashPassword('labpassword')
    }
  });


  // 4. Seed Projects
  console.log('Seeding Projects...');
  const projectsMap = new Set<string>();
  for (const item of projectsSection) {
    const fm = item.frontmatter || {};
    if (!fm.id) continue;
    projectsMap.add(fm.id);

    // Clean up team linking, verifying IDs exist in staff table
    const validStaffConnect = Array.isArray(fm.related_staff)
      ? fm.related_staff.filter((id: string) => staffMap.has(id)).map((id: string) => ({ id }))
      : [];

    await prisma.project.upsert({
      where: { id: fm.id },
      update: {
        title: fm.title || 'Untitled Project',
        name: fm.name || 'Untitled Project',
        description: fm.description || null,
        image: fm.image || null,
        status: fm.status || 'ongoing',
        visibility: 'public', // Set to public since they come from public Hugo repo
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        year: fm.year ? String(fm.year) : null,
        projectType: fm.project_type || null,
        draft: typeof fm.draft === 'boolean' ? fm.draft : false,
        team: {
          set: validStaffConnect
        }
      },
      create: {
        id: fm.id,
        title: fm.title || 'Untitled Project',
        name: fm.name || 'Untitled Project',
        description: fm.description || null,
        image: fm.image || null,
        status: fm.status || 'ongoing',
        visibility: 'public',
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        year: fm.year ? String(fm.year) : null,
        projectType: fm.project_type || null,
        draft: typeof fm.draft === 'boolean' ? fm.draft : false,
        team: {
          connect: validStaffConnect
        }
      }
    });
  }

  // 5. Seed Publications
  console.log('Seeding Publications...');
  for (const item of publicationsSection) {
    const fm = item.frontmatter || {};
    if (!fm.id) continue;

    // Map co-authors
    const validAuthorsConnect = Array.isArray(fm.authors)
      ? fm.authors
          .filter((a: any) => a && a.staff && staffMap.has(a.staff))
          .map((a: any) => ({ id: a.staff }))
      : [];

    await prisma.publication.upsert({
      where: { id: fm.id },
      update: {
        title: fm.title || 'Untitled Publication',
        pubType: fm.type || 'article',
        degree: fm.degree || null,
        year: fm.year ? String(fm.year) : null,
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        description: fm.description || null,
        pdf: fm.pdf || null,
        journal: fm.journal || null,
        supervisorId: (fm.supervisor && staffMap.has(fm.supervisor)) ? fm.supervisor : null,
        draft: typeof fm.draft === 'boolean' ? fm.draft : false,
        authors: {
          set: validAuthorsConnect
        }
      },
      create: {
        id: fm.id,
        title: fm.title || 'Untitled Publication',
        pubType: fm.type || 'article',
        degree: fm.degree || null,
        year: fm.year ? String(fm.year) : null,
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        description: fm.description || null,
        pdf: fm.pdf || null,
        journal: fm.journal || null,
        supervisorId: (fm.supervisor && staffMap.has(fm.supervisor)) ? fm.supervisor : null,
        draft: typeof fm.draft === 'boolean' ? fm.draft : false,
        authors: {
          connect: validAuthorsConnect
        }
      }
    });
  }

  // 6. Seed Laboratories & Equipment
  console.log('Seeding Laboratories...');
  const labsMap = new Set<string>();
  for (const item of labsSection) {
    const fm = item.frontmatter || {};
    if (!fm.id) continue;
    labsMap.add(fm.id);

    await prisma.lab.upsert({
      where: { id: fm.id },
      update: {
        title: fm.title || 'Untitled Laboratory',
        shortName: fm.short_name || null,
        location: fm.location || null,
        locationName: fm.location_name || null,
        department: fm.department || null,
        departmentName: fm.department_name || null,
        category: fm.category || null,
        categoryName: fm.category_name || null,
        description: fm.description || null,
        image: fm.image || null,
        contact: fm.contact || null,
        capacity: fm.capacity || null,
        status: fm.status || 'active',
        draft: typeof fm.draft === 'boolean' ? fm.draft : false
      },
      create: {
        id: fm.id,
        title: fm.title || 'Untitled Laboratory',
        shortName: fm.short_name || null,
        location: fm.location || null,
        locationName: fm.location_name || null,
        department: fm.department || null,
        departmentName: fm.department_name || null,
        category: fm.category || null,
        categoryName: fm.category_name || null,
        description: fm.description || null,
        image: fm.image || null,
        contact: fm.contact || null,
        capacity: fm.capacity || null,
        status: fm.status || 'active',
        draft: typeof fm.draft === 'boolean' ? fm.draft : false
      }
    });

    // Seed equipment inside this lab
    if (fm.equipment && Array.isArray(fm.equipment)) {
      for (const eqItem of fm.equipment) {
        if (!eqItem.id) continue;

        await prisma.equipment.upsert({
          where: { id: eqItem.id },
          update: {
            name: eqItem.name || 'Untitled Equipment',
            labId: fm.id,
            category: eqItem.category || null,
            description: eqItem.description || null,
            status: eqItem.status || 'available',
            workingUnits: typeof eqItem.working_units === 'number' ? eqItem.working_units : 1,
            outOfOrder: typeof eqItem.out_of_order === 'number' ? eqItem.out_of_order : 0,
            totalUnits: typeof eqItem.total_units === 'number' ? eqItem.total_units : 1,
            model: eqItem.model || null,
            specifications: Array.isArray(eqItem.specifications) ? eqItem.specifications : []
          },
          create: {
            id: eqItem.id,
            name: eqItem.name || 'Untitled Equipment',
            labId: fm.id,
            category: eqItem.category || null,
            description: eqItem.description || null,
            status: eqItem.status || 'available',
            workingUnits: typeof eqItem.working_units === 'number' ? eqItem.working_units : 1,
            outOfOrder: typeof eqItem.out_of_order === 'number' ? eqItem.out_of_order : 0,
            totalUnits: typeof eqItem.total_units === 'number' ? eqItem.total_units : 1,
            model: eqItem.model || null,
            specifications: Array.isArray(eqItem.specifications) ? eqItem.specifications : []
          }
        });
      }
    }
  }

  // 7. Seed Regulations
  console.log('Seeding Regulations & Policies...');
  for (const item of regulationsSection) {
    const fm = item.frontmatter || {};
    if (!fm.title) continue;
    
    // Since regulations don't have unique IDs in Hugo frontmatter, we query by title/category
    const existing = await prisma.regulation.findFirst({
      where: { title: fm.title, category: fm.category || 'General' }
    });

    if (existing) {
      await prisma.regulation.update({
        where: { id: existing.id },
        data: {
          description: fm.description || null,
          filePath: fm.file || '',
          fileSize: fm.size || null,
          lastUpdated: fm.last_updated ? new Date(fm.last_updated) : null,
          draft: typeof fm.draft === 'boolean' ? fm.draft : false
        }
      });
    } else {
      await prisma.regulation.create({
        data: {
          title: fm.title,
          category: fm.category || 'General',
          description: fm.description || null,
          filePath: fm.file || '',
          fileSize: fm.size || null,
          lastUpdated: fm.last_updated ? new Date(fm.last_updated) : null,
          draft: typeof fm.draft === 'boolean' ? fm.draft : false
        }
      });
    }
  }

  // 8. Seed Forms & Templates
  console.log('Seeding Forms & Templates...');
  for (const item of templatesSection) {
    const fm = item.frontmatter || {};
    if (!fm.title) continue;

    const existing = await prisma.form.findFirst({
      where: { title: fm.title, category: fm.category || 'General' }
    });

    if (existing) {
      await prisma.form.update({
        where: { id: existing.id },
        data: {
          description: fm.description || null,
          filePath: fm.file || '',
          fileFormat: fm.format || null,
          fileSize: fm.size || null,
          icon: fm.icon || 'fas fa-file-alt',
          draft: typeof fm.draft === 'boolean' ? fm.draft : false
        }
      });
    } else {
      await prisma.form.create({
        data: {
          title: fm.title,
          category: fm.category || 'General',
          description: fm.description || null,
          filePath: fm.file || '',
          fileFormat: fm.format || null,
          fileSize: fm.size || null,
          icon: fm.icon || 'fas fa-file-alt',
          draft: typeof fm.draft === 'boolean' ? fm.draft : false
        }
      });
    }
  }

  // 9. Seed Datasets
  console.log('Seeding Datasets...');
  for (const item of datasetsSection) {
    const fm = item.frontmatter || {};
    if (!fm.id) continue;
    
    await prisma.dataset.upsert({
      where: { id: fm.id },
      update: {
        title: fm.title || 'Untitled Dataset',
        description: fm.description || null,
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        year: fm.year ? String(fm.year) : null,
        access: fm.access || 'Open',
        format: fm.format || null,
        size: fm.size || null,
        draft: typeof fm.draft === 'boolean' ? fm.draft : false
      },
      create: {
        id: fm.id,
        title: fm.title || 'Untitled Dataset',
        description: fm.description || null,
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        year: fm.year ? String(fm.year) : null,
        access: fm.access || 'Open',
        format: fm.format || null,
        size: fm.size || null,
        draft: typeof fm.draft === 'boolean' ? fm.draft : false
      }
    });
  }

  // 10. Seed Testimonials
  console.log('Seeding Testimonials...');
  for (const item of testimonialsSection) {
    const fm = item.frontmatter || {};
    // Testimonials do not have unique IDs in markdown files, let's query by title/name
    const titleVal = fm.title || fm.name || 'Anonymous';
    const existing = await prisma.testimonial.findFirst({
      where: { title: titleVal }
    });

    if (existing) {
      await prisma.testimonial.update({
        where: { id: existing.id },
        data: {
          quote: fm.content || item.body || '',
          position: fm.designation || null,
          image: fm.image || null,
          draft: typeof fm.draft === 'boolean' ? fm.draft : false
        }
      });
    } else {
      await prisma.testimonial.create({
        data: {
          title: titleVal,
          quote: fm.content || item.body || '',
          position: fm.designation || null,
          image: fm.image || null,
          draft: typeof fm.draft === 'boolean' ? fm.draft : false
        }
      });
    }
  }

  // 11. Seed Events
  console.log('Seeding Events...');
  for (const item of eventsSection) {
    const fm = item.frontmatter || {};
    if (!fm.title) continue;

    // Use slug as the unique key
    const fileSlug = item.file_name ? item.file_name.replace('.md', '') : fm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    await prisma.event.upsert({
      where: { slug: fileSlug },
      update: {
        title: fm.title,
        eventDate: fm.date ? new Date(fm.date) : new Date(),
        image: fm.image || null,
        eventType: fm.type || 'regular',
        featured: typeof fm.featured === 'boolean' ? fm.featured : false,
        description: fm.description || null,
        content: item.body || null,
        category: fm.category || null,
        eventTime: fm.time || null,
        location: fm.location || null,
        draft: typeof fm.draft === 'boolean' ? fm.draft : false
      },
      create: {
        title: fm.title,
        slug: fileSlug,
        eventDate: fm.date ? new Date(fm.date) : new Date(),
        image: fm.image || null,
        eventType: fm.type || 'regular',
        featured: typeof fm.featured === 'boolean' ? fm.featured : false,
        description: fm.description || null,
        content: item.body || null,
        category: fm.category || null,
        eventTime: fm.time || null,
        location: fm.location || null,
        draft: typeof fm.draft === 'boolean' ? fm.draft : false
      }
    });
  }

  console.log('Successfully completed seeding the database!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
