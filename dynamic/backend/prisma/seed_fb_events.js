const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const jsonPath = path.join(__dirname, '../../../research_center_facebook_archive1/migrated_events.json');

async function main() {
  console.log('--- MIGRATING FACEBOOK ARCHIVE EVENTS TO POSTGRESQL ---\n');

  if (!fs.existsSync(jsonPath)) {
    console.error('Error: migrated_events.json not found at:', jsonPath);
    return;
  }

  const eventsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Found ${eventsData.length} events in migrated_events.json`);

  // 1. Wipe existing events in database
  const deleted = await prisma.event.deleteMany({});
  console.log(`Cleared ${deleted.count} old demo events from PostgreSQL.`);

  // 2. Insert new Facebook Archive events
  let insertedCount = 0;
  for (const item of eventsData) {
    await prisma.event.create({
      data: {
        title: item.title,
        slug: item.slug,
        eventDate: new Date(item.eventDate),
        image: item.image || null,
        galleryImages: item.galleryImages || [],
        eventType: item.eventType || 'seminar',
        featured: item.featured || false,
        description: item.description || null,
        content: item.content || null,
        category: item.category || 'Research Activity',
        eventTime: item.eventTime || '10:00 AM - 01:00 PM',
        location: item.location || 'Salahaddin University-Erbil Research Center',
        draft: false
      }
    });
    insertedCount++;
  }

  console.log(`\nSUCCESS: Inserted ${insertedCount} real Facebook Research Center events into PostgreSQL database!`);
}

main().finally(() => prisma.$disconnect());
