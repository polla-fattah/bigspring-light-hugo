import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Reading content_data.json...');
  const jsonPath = path.resolve(__dirname, '../../../migration/content_data.json');
  
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Data file not found at: ${jsonPath}`);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(rawData);

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
  if (data.units && Array.isArray(data.units)) {
    for (const unit of data.units) {
      if (!unit.id) continue;
      unitsMap.add(unit.id);
      await prisma.researchUnit.upsert({
        where: { id: unit.id },
        update: {
          title: unit.title || 'Untitled Unit',
          name: unit.name || 'Untitled Unit',
          image: unit.image || null,
          description: unit.description || null,
          draft: typeof unit.draft === 'boolean' ? unit.draft : false
        },
        create: {
          id: unit.id,
          title: unit.title || 'Untitled Unit',
          name: unit.name || 'Untitled Unit',
          image: unit.image || null,
          description: unit.description || null,
          draft: typeof unit.draft === 'boolean' ? unit.draft : false
        }
      });
    }
  }

  // 3. Seed Users & Staff
  console.log('Seeding Users & Staff...');
  const staffMap = new Set<string>();
  if (data.staff && Array.isArray(data.staff)) {
    for (const member of data.staff) {
      if (!member.id) continue;
      staffMap.add(member.id);

      // Create a default User account first for authentication
      const email = member.email || `${member.id}@su.edu.krd`;
      const name = member.title || 'Researcher';
      
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          name,
          image: member.image || null,
          role: 'researcher'
        },
        create: {
          name,
          email,
          image: member.image || null,
          role: 'researcher'
        }
      });

      // Seed staff profile linked to user
      await prisma.staff.upsert({
        where: { id: member.id },
        update: {
          userId: user.id,
          title: member.title || 'Untitled Staff',
          subtitle: member.subtitle || null,
          image: member.image || null,
          unitId: (member.unit && unitsMap.has(member.unit)) ? member.unit : null,
          titlePosition: member.title_position || null,
          email: member.email || null,
          orcid: member.orcid || null,
          googleScholar: member.google_scholar || null,
          scopus: member.scopus || null,
          researchgate: member.researchgate || null,
          personalWebsite: member.personal_website || null,
          bio: member.bio || null,
          content: member.content || null,
          description: member.description || null,
          researchAreas: Array.isArray(member.research_areas) ? member.research_areas : [],
          draft: typeof member.draft === 'boolean' ? member.draft : false
        },
        create: {
          id: member.id,
          userId: user.id,
          title: member.title || 'Untitled Staff',
          subtitle: member.subtitle || null,
          image: member.image || null,
          unitId: (member.unit && unitsMap.has(member.unit)) ? member.unit : null,
          titlePosition: member.title_position || null,
          email: member.email || null,
          orcid: member.orcid || null,
          googleScholar: member.google_scholar || null,
          scopus: member.scopus || null,
          researchgate: member.researchgate || null,
          personalWebsite: member.personal_website || null,
          bio: member.bio || null,
          content: member.content || null,
          description: member.description || null,
          researchAreas: Array.isArray(member.research_areas) ? member.research_areas : [],
          draft: typeof member.draft === 'boolean' ? member.draft : false
        }
      });
    }
  }

  // 4. Seed Projects
  console.log('Seeding Projects...');
  const projectsMap = new Set<string>();
  if (data.projects && Array.isArray(data.projects)) {
    for (const project of data.projects) {
      if (!project.id) continue;
      projectsMap.add(project.id);

      // Clean up team linking, verifying IDs exist in staff table
      const validStaffConnect = Array.isArray(project.related_staff)
        ? project.related_staff.filter((id: string) => staffMap.has(id)).map((id: string) => ({ id }))
        : [];

      await prisma.project.upsert({
        where: { id: project.id },
        update: {
          title: project.title || 'Untitled Project',
          name: project.name || 'Untitled Project',
          description: project.description || null,
          image: project.image || null,
          status: project.status || 'ongoing',
          visibility: 'public', // Set to public since they come from public Hugo repo
          unitId: (project.unit && unitsMap.has(project.unit)) ? project.unit : null,
          year: project.year ? String(project.year) : null,
          projectType: project.project_type || null,
          draft: typeof project.draft === 'boolean' ? project.draft : false,
          team: {
            set: validStaffConnect
          }
        },
        create: {
          id: project.id,
          title: project.title || 'Untitled Project',
          name: project.name || 'Untitled Project',
          description: project.description || null,
          image: project.image || null,
          status: project.status || 'ongoing',
          visibility: 'public',
          unitId: (project.unit && unitsMap.has(project.unit)) ? project.unit : null,
          year: project.year ? String(project.year) : null,
          projectType: project.project_type || null,
          draft: typeof project.draft === 'boolean' ? project.draft : false,
          team: {
            connect: validStaffConnect
          }
        }
      });
    }
  }

  // 5. Seed Publications
  console.log('Seeding Publications...');
  if (data.publications && Array.isArray(data.publications)) {
    for (const pub of data.publications) {
      if (!pub.id) continue;

      // Map co-authors
      const validAuthorsConnect = Array.isArray(pub.authors)
        ? pub.authors
            .filter((a: any) => a && a.staff && staffMap.has(a.staff))
            .map((a: any) => ({ id: a.staff }))
        : [];

      await prisma.publication.upsert({
        where: { id: pub.id },
        update: {
          title: pub.title || 'Untitled Publication',
          pubType: pub.type || 'article',
          degree: pub.degree || null,
          year: pub.year ? String(pub.year) : null,
          unitId: (pub.unit && unitsMap.has(pub.unit)) ? pub.unit : null,
          description: pub.description || null,
          pdf: pub.pdf || null,
          journal: pub.journal || null,
          supervisorId: (pub.supervisor && staffMap.has(pub.supervisor)) ? pub.supervisor : null,
          draft: typeof pub.draft === 'boolean' ? pub.draft : false,
          authors: {
            set: validAuthorsConnect
          }
        },
        create: {
          id: pub.id,
          title: pub.title || 'Untitled Publication',
          pubType: pub.type || 'article',
          degree: pub.degree || null,
          year: pub.year ? String(pub.year) : null,
          unitId: (pub.unit && unitsMap.has(pub.unit)) ? pub.unit : null,
          description: pub.description || null,
          pdf: pub.pdf || null,
          journal: pub.journal || null,
          supervisorId: (pub.supervisor && staffMap.has(pub.supervisor)) ? pub.supervisor : null,
          draft: typeof pub.draft === 'boolean' ? pub.draft : false,
          authors: {
            connect: validAuthorsConnect
          }
        }
      });
    }
  }

  // 6. Seed Laboratories & Equipment
  console.log('Seeding Laboratories...');
  const labsMap = new Set<string>();
  if (data.labs && Array.isArray(data.labs)) {
    for (const lab of data.labs) {
      if (!lab.id) continue;
      labsMap.add(lab.id);

      await prisma.lab.upsert({
        where: { id: lab.id },
        update: {
          title: lab.title || 'Untitled Laboratory',
          shortName: lab.short_name || null,
          location: lab.location || null,
          locationName: lab.location_name || null,
          department: lab.department || null,
          departmentName: lab.department_name || null,
          category: lab.category || null,
          categoryName: lab.category_name || null,
          description: lab.description || null,
          image: lab.image || null,
          contact: lab.contact || null,
          capacity: lab.capacity || null,
          status: lab.status || 'active',
          draft: typeof lab.draft === 'boolean' ? lab.draft : false
        },
        create: {
          id: lab.id,
          title: lab.title || 'Untitled Laboratory',
          shortName: lab.short_name || null,
          location: lab.location || null,
          locationName: lab.location_name || null,
          department: lab.department || null,
          departmentName: lab.department_name || null,
          category: lab.category || null,
          categoryName: lab.category_name || null,
          description: lab.description || null,
          image: lab.image || null,
          contact: lab.contact || null,
          capacity: lab.capacity || null,
          status: lab.status || 'active',
          draft: typeof lab.draft === 'boolean' ? lab.draft : false
        }
      });

      // Seed equipment inside this lab
      if (lab.equipment && Array.isArray(lab.equipment)) {
        for (const item of lab.equipment) {
          if (!item.id) continue;

          await prisma.equipment.upsert({
            where: { id: item.id },
            update: {
              name: item.name || 'Untitled Equipment',
              labId: lab.id,
              category: item.category || null,
              description: item.description || null,
              status: item.status || 'available',
              workingUnits: typeof item.working_units === 'number' ? item.working_units : 1,
              outOfOrder: typeof item.out_of_order === 'number' ? item.out_of_order : 0,
              totalUnits: typeof item.total_units === 'number' ? item.total_units : 1,
              model: item.model || null,
              specifications: Array.isArray(item.specifications) ? item.specifications : []
            },
            create: {
              id: item.id,
              name: item.name || 'Untitled Equipment',
              labId: lab.id,
              category: item.category || null,
              description: item.description || null,
              status: item.status || 'available',
              workingUnits: typeof item.working_units === 'number' ? item.working_units : 1,
              outOfOrder: typeof item.out_of_order === 'number' ? item.out_of_order : 0,
              totalUnits: typeof item.total_units === 'number' ? item.total_units : 1,
              model: item.model || null,
              specifications: Array.isArray(item.specifications) ? item.specifications : []
            }
          });
        }
      }
    }
  }

  // 7. Seed Regulations
  console.log('Seeding Regulations & Policies...');
  if (data.regulations && Array.isArray(data.regulations)) {
    for (const reg of data.regulations) {
      if (!reg.title) continue;
      
      // Since regulations don't have unique IDs in Hugo frontmatter, we query by title/category
      const existing = await prisma.regulation.findFirst({
        where: { title: reg.title, category: reg.category || 'General' }
      });

      if (existing) {
        await prisma.regulation.update({
          where: { id: existing.id },
          data: {
            description: reg.description || null,
            filePath: reg.file || '',
            fileSize: reg.size || null,
            lastUpdated: reg.last_updated ? new Date(reg.last_updated) : null,
            draft: typeof reg.draft === 'boolean' ? reg.draft : false
          }
        });
      } else {
        await prisma.regulation.create({
          data: {
            title: reg.title,
            category: reg.category || 'General',
            description: reg.description || null,
            filePath: reg.file || '',
            fileSize: reg.size || null,
            lastUpdated: reg.last_updated ? new Date(reg.last_updated) : null,
            draft: typeof reg.draft === 'boolean' ? reg.draft : false
          }
        });
      }
    }
  }

  // 8. Seed Forms & Templates
  console.log('Seeding Forms & Templates...');
  if (data.templates && Array.isArray(data.templates)) {
    for (const template of data.templates) {
      if (!template.title) continue;

      const existing = await prisma.form.findFirst({
        where: { title: template.title, category: template.category || 'General' }
      });

      if (existing) {
        await prisma.form.update({
          where: { id: existing.id },
          data: {
            description: template.description || null,
            filePath: template.file || '',
            fileFormat: template.format || null,
            fileSize: template.size || null,
            icon: template.icon || 'fas fa-file-alt',
            draft: typeof template.draft === 'boolean' ? template.draft : false
          }
        });
      } else {
        await prisma.form.create({
          data: {
            title: template.title,
            category: template.category || 'General',
            description: template.description || null,
            filePath: template.file || '',
            fileFormat: template.format || null,
            fileSize: template.size || null,
            icon: template.icon || 'fas fa-file-alt',
            draft: typeof template.draft === 'boolean' ? template.draft : false
          }
        });
      }
    }
  }

  // 9. Seed Datasets
  console.log('Seeding Datasets...');
  if (data.datasets && Array.isArray(data.datasets)) {
    for (const ds of data.datasets) {
      if (!ds.id) continue;
      
      await prisma.dataset.upsert({
        where: { id: ds.id },
        update: {
          title: ds.title || 'Untitled Dataset',
          description: ds.description || null,
          unitId: (ds.unit && unitsMap.has(ds.unit)) ? ds.unit : null,
          year: ds.year ? String(ds.year) : null,
          access: ds.access || 'Open',
          format: ds.format || null,
          size: ds.size || null,
          draft: typeof ds.draft === 'boolean' ? ds.draft : false
        },
        create: {
          id: ds.id,
          title: ds.title || 'Untitled Dataset',
          description: ds.description || null,
          unitId: (ds.unit && unitsMap.has(ds.unit)) ? ds.unit : null,
          year: ds.year ? String(ds.year) : null,
          access: ds.access || 'Open',
          format: ds.format || null,
          size: ds.size || null,
          draft: typeof ds.draft === 'boolean' ? ds.draft : false
        }
      });
    }
  }

  // 10. Seed Testimonials
  console.log('Seeding Testimonials...');
  if (data.testimonials && Array.isArray(data.testimonials)) {
    for (const test of data.testimonials) {
      const existing = await prisma.testimonial.findFirst({
        where: { title: test.title || 'Anonymous' }
      });

      if (existing) {
        await prisma.testimonial.update({
          where: { id: existing.id },
          data: {
            quote: test.quote || '',
            position: test.position || null,
            image: test.image || null,
            draft: typeof test.draft === 'boolean' ? test.draft : false
          }
        });
      } else {
        await prisma.testimonial.create({
          data: {
            title: test.title || 'Anonymous',
            quote: test.quote || '',
            position: test.position || null,
            image: test.image || null,
            draft: typeof test.draft === 'boolean' ? test.draft : false
          }
        });
      }
    }
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
