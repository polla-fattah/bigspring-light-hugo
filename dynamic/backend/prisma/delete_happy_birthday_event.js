const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.event.deleteMany({
    where: {
      OR: [
        { slug: 'happy-birthday-1' },
        { title: { contains: 'Happy Birthday', mode: 'insensitive' } },
        { title: { contains: 'Birthday', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`Deleted ${deleted.count} test/birthday events from PostgreSQL database!`);
}

main().finally(() => prisma.$disconnect());
