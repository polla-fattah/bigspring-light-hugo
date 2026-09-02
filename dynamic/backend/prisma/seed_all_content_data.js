const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { pbkdf2Sync, randomBytes } = require('crypto');

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function generateStrongPassword(index) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
  let pass = 'SUE2026!';
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i++) {
    pass += chars[bytes[i] % chars.length];
  }
  return pass;
}

const prisma = new PrismaClient();

async function main() {
  let jsonPath = path.resolve(__dirname, 'content_data.json');
  if (!fs.existsSync(jsonPath)) {
    jsonPath = path.resolve(__dirname, '../../migration/content_data.json');
  }

  if (!fs.existsSync(jsonPath)) {
    console.error(`Data file content_data.json not found!`);
    return;
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(rawData);

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

  console.log(`--- SEEDING ALL DATABASE CONTENT ---`);
  console.log(`Counts: Units(${unitsSection.length}), Staff(${staffSection.length}), Projects(${projectsSection.length}), Publications(${publicationsSection.length}), Labs(${labsSection.length}), Events(${eventsSection.length})`);

  // 1. Seed System Settings
  const defaultSettings = [
    { keyName: 'vision_statement', valueText: 'Advanced data analytics, interdisciplinary research, and technological innovation to address local and global challenges in the Kurdistan Region and beyond.' },
    { keyName: 'mission_statement', valueText: 'To promote excellent scientific inquiry, support academic staff at Salahaddin University-Erbil, manage specialized laboratory equipment, and publish impactful research outputs.' },
    { keyName: 'homepage_president_quote', valueText: 'Salahaddin University Research Center represents our dedication to scientific advancement, academic integrity, and policy-driven development.' }
  ];
  for (const s of defaultSettings) {
    await prisma.systemSettings.upsert({
      where: { keyName: s.keyName },
      update: { valueText: s.valueText },
      create: { keyName: s.keyName, valueText: s.valueText }
    });
  }

  // 2. Seed Units
  const unitsMap = new Set();
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
        draft: Boolean(fm.draft)
      },
      create: {
        id: fm.id,
        title: fm.title || 'Untitled Unit',
        name: fm.name || 'Untitled Unit',
        image: fm.image || null,
        description: fm.description || null,
        draft: Boolean(fm.draft)
      }
    });
  }

  // 3. Seed Users & Staff with Secure Strong Passwords
  const staffCredentialsRoster = [];
  const staffMap = new Set();

  for (let i = 0; i < staffSection.length; i++) {
    const item = staffSection[i];
    const fm = item.frontmatter || {};
    if (!fm.id) continue;
    staffMap.add(fm.id);

    const rawEmail = fm.email || `${fm.id}@su.edu.krd`;
    const email = rawEmail.toLowerCase().trim();
    const name = fm.title || 'SUE Researcher';
    
    // Generate secure password
    const plainPassword = (email === 'polla.fattah@su.edu.krd') ? 'PollaSUE#2026' : generateStrongPassword(i);
    const passwordHash = hashPassword(plainPassword);
    const role = (email === 'polla.fattah@su.edu.krd' || email === 'admin@su.edu.krd') ? 'superadmin' : 'researcher';

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        image: fm.image || null,
        role
      },
      create: {
        name,
        email,
        image: fm.image || null,
        role,
        passwordHash,
        emailVerified: new Date()
      }
    });

    // Ensure no other staff record holds this userId or email
    await prisma.staff.updateMany({
      where: { userId: user.id, id: { not: fm.id } },
      data: { userId: null }
    });

    await prisma.staff.updateMany({
      where: { email, id: { not: fm.id } },
      data: { email: null }
    });

    // Ensure staff link
    await prisma.staff.upsert({
      where: { id: fm.id },
      update: {
        userId: user.id,
        title: fm.title || 'Untitled Staff',
        subtitle: fm.subtitle || null,
        image: fm.image || null,
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        titlePosition: fm.title_position || null,
        email,
        orcid: fm.orcid || null,
        googleScholar: fm.google_scholar || null,
        scopus: fm.scopus || null,
        researchgate: fm.research_gate || null,
        researchAreas: Array.isArray(fm.research_focus) ? fm.research_focus : [],
        bio: item.content || null,
        draft: Boolean(fm.draft)
      },
      create: {
        id: fm.id,
        userId: user.id,
        title: fm.title || 'Untitled Staff',
        subtitle: fm.subtitle || null,
        image: fm.image || null,
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        titlePosition: fm.title_position || null,
        email,
        orcid: fm.orcid || null,
        googleScholar: fm.google_scholar || null,
        scopus: fm.scopus || null,
        researchgate: fm.research_gate || null,
        researchAreas: Array.isArray(fm.research_focus) ? fm.research_focus : [],
        bio: item.content || null,
        draft: Boolean(fm.draft)
      }
    });

    staffCredentialsRoster.push({
      id: fm.id,
      name,
      email,
      role,
      tempPassword: plainPassword
    });
  }

  // 4. Seed Projects
  for (const item of projectsSection) {
    const fm = item.frontmatter || {};
    if (!fm.id) continue;
    await prisma.project.upsert({
      where: { id: fm.id },
      update: {
        title: fm.title || 'Untitled Project',
        name: fm.name || fm.title || 'Untitled Project',
        image: fm.image || null,
        year: fm.year ? String(fm.year) : null,
        status: fm.status || 'ongoing',
        visibility: 'public',
        projectType: fm.project_type || 'Funded Research',
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        description: item.content || fm.description || null,
        draft: Boolean(fm.draft)
      },
      create: {
        id: fm.id,
        title: fm.title || 'Untitled Project',
        name: fm.name || fm.title || 'Untitled Project',
        image: fm.image || null,
        year: fm.year ? String(fm.year) : null,
        status: fm.status || 'ongoing',
        visibility: 'public',
        projectType: fm.project_type || 'Funded Research',
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        description: item.content || fm.description || null,
        draft: Boolean(fm.draft)
      }
    });
  }

  // 5. Seed Publications
  for (const item of publicationsSection) {
    const fm = item.frontmatter || {};
    if (!fm.id) continue;
    await prisma.publication.upsert({
      where: { id: fm.id },
      update: {
        title: fm.title || 'Untitled Publication',
        pubType: fm.pub_type || 'article',
        degree: fm.degree || null,
        year: fm.year ? String(fm.year) : null,
        journal: fm.journal || null,
        pdf: fm.pdf || fm.link || null,
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        supervisorId: (fm.supervisor && staffMap.has(fm.supervisor)) ? fm.supervisor : null,
        description: item.content || fm.description || null,
        draft: Boolean(fm.draft)
      },
      create: {
        id: fm.id,
        title: fm.title || 'Untitled Publication',
        pubType: fm.pub_type || 'article',
        degree: fm.degree || null,
        year: fm.year ? String(fm.year) : null,
        journal: fm.journal || null,
        pdf: fm.pdf || fm.link || null,
        unitId: (fm.unit && unitsMap.has(fm.unit)) ? fm.unit : null,
        supervisorId: (fm.supervisor && staffMap.has(fm.supervisor)) ? fm.supervisor : null,
        description: item.content || fm.description || null,
        draft: Boolean(fm.draft)
      }
    });
  }

  // 6. Seed Labs
  for (const item of labsSection) {
    const fm = item.frontmatter || {};
    if (!fm.id) continue;
    await prisma.lab.upsert({
      where: { id: fm.id },
      update: {
        title: fm.title || 'Untitled Lab',
        shortName: fm.short_name || null,
        location: fm.location || null,
        locationName: fm.location_name || null,
        department: fm.department || null,
        departmentName: fm.department_name || null,
        category: fm.category || null,
        categoryName: fm.category_name || null,
        contact: fm.head_email || fm.head_phone || null,
        image: fm.image || null,
        description: item.content || fm.description || null,
        draft: Boolean(fm.draft)
      },
      create: {
        id: fm.id,
        title: fm.title || 'Untitled Lab',
        shortName: fm.short_name || null,
        location: fm.location || null,
        locationName: fm.location_name || null,
        department: fm.department || null,
        departmentName: fm.department_name || null,
        category: fm.category || null,
        categoryName: fm.category_name || null,
        contact: fm.head_email || fm.head_phone || null,
        image: fm.image || null,
        description: item.content || fm.description || null,
        draft: Boolean(fm.draft)
      }
    });
  }

  // 7. Seed Datasets, Regulations, Templates & Events
  for (const item of datasetsSection) {
    const fm = item.frontmatter || {};
    if (!fm.id) continue;
    await prisma.dataset.upsert({
      where: { id: fm.id },
      update: {
        title: fm.title || 'Untitled Dataset',
        year: fm.year ? String(fm.year) : null,
        format: fm.format || 'CSV',
        access: fm.access || 'Open Access',
        size: fm.size || null,
        description: item.content || fm.description || null
      },
      create: {
        id: fm.id,
        title: fm.title || 'Untitled Dataset',
        year: fm.year ? String(fm.year) : null,
        format: fm.format || 'CSV',
        access: fm.access || 'Open Access',
        size: fm.size || null,
        description: item.content || fm.description || null
      }
    });
  }

  for (let i = 0; i < regulationsSection.length; i++) {
    const item = regulationsSection[i];
    const fm = item.frontmatter || {};
    const regId = i + 1;
    await prisma.regulation.upsert({
      where: { id: regId },
      update: {
        title: fm.title || 'Policy Document',
        category: fm.category || 'Ethics & Governance',
        filePath: fm.pdf_url || fm.download_url || '#',
        fileSize: fm.file_size || '1.2 MB',
        description: item.content || fm.description || null
      },
      create: {
        id: regId,
        title: fm.title || 'Policy Document',
        category: fm.category || 'Ethics & Governance',
        filePath: fm.pdf_url || fm.download_url || '#',
        fileSize: fm.file_size || '1.2 MB',
        description: item.content || fm.description || null
      }
    });
  }

  for (let i = 0; i < templatesSection.length; i++) {
    const item = templatesSection[i];
    const fm = item.frontmatter || {};
    const formId = i + 1;
    await prisma.form.upsert({
      where: { id: formId },
      update: {
        title: fm.title || 'Proposal Form',
        category: fm.category || 'Proposals',
        formType: fm.form_type || 'proposal',
        filePath: fm.download_url || '#',
        fileFormat: fm.doc_type || 'DOCX',
        fileSize: fm.file_size || '500 KB',
        description: item.content || fm.description || null
      },
      create: {
        id: formId,
        title: fm.title || 'Proposal Form',
        category: fm.category || 'Proposals',
        formType: fm.form_type || 'proposal',
        filePath: fm.download_url || '#',
        fileFormat: fm.doc_type || 'DOCX',
        fileSize: fm.file_size || '500 KB',
        description: item.content || fm.description || null
      }
    });
  }

  for (let i = 0; i < eventsSection.length; i++) {
    const item = eventsSection[i];
    const fm = item.frontmatter || {};
    const eventId = i + 1;
    const slug = fm.slug || fm.id || `event-${eventId}`;
    const dateVal = fm.date ? new Date(fm.date) : new Date();

    await prisma.event.upsert({
      where: { id: eventId },
      update: {
        title: fm.title || 'Research Event',
        slug,
        eventDate: isNaN(dateVal.getTime()) ? new Date() : dateVal,
        location: fm.location || 'SUE Campus, Erbil',
        image: fm.image || null,
        galleryImages: Array.isArray(fm.photos) ? fm.photos : [],
        content: item.content || null,
        description: fm.description || null,
        category: fm.category || 'Conference'
      },
      create: {
        id: eventId,
        title: fm.title || 'Research Event',
        slug,
        eventDate: isNaN(dateVal.getTime()) ? new Date() : dateVal,
        location: fm.location || 'SUE Campus, Erbil',
        image: fm.image || null,
        galleryImages: Array.isArray(fm.photos) ? fm.photos : [],
        content: item.content || null,
        description: fm.description || null,
        category: fm.category || 'Conference'
      }
    });
  }

  console.log(`✅ SUCCESS! All database tables populated cleanly.`);

  // Write Staff Roster File
  let rosterMd = `# 🎓 SUE Research Center - Staff Account Credentials Roster\n\n`;
  rosterMd += `Generated on ${new Date().toISOString()}\n\n`;
  rosterMd += `| # | Researcher Name | Official SUE Email | Access Role | Temporary Secure Password |\n`;
  rosterMd += `|---|---|---|---|---|\n`;

  staffCredentialsRoster.forEach((staff, idx) => {
    rosterMd += `| ${idx + 1} | **${staff.name}** | \`${staff.email}\` | \`${staff.role}\` | \`${staff.tempPassword}\` |\n`;
  });

  const rosterPath = path.resolve(__dirname, '../../../STAFF_ACCOUNTS_ROSTER.md');
  fs.writeFileSync(rosterPath, rosterMd, 'utf8');
  console.log(`📄 Staff roster written to ${rosterPath}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
