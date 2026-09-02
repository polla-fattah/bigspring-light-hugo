const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const staff = await prisma.staff.findMany({ select: { id: true, title: true, image: true } });

  console.log(`Updating staff images in PostgreSQL...`);

  for (const s of staff) {
    let img = null;
    const titleLower = s.title.toLowerCase();

    if (titleLower.includes('polla')) {
      img = '/images/staff/polla.png';
    } else if (titleLower.includes('samir')) {
      img = '/images/staff/samir.png';
    }

    await prisma.staff.update({
      where: { id: s.id },
      data: { image: img }
    });
  }

  console.log('SUCCESS: Reset staff images to null (except real headshots for Dr. Polla & Dr. Samir)!');
}

main().finally(() => prisma.$disconnect());
