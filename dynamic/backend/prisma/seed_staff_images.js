const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const staff = await prisma.staff.findMany({ select: { id: true, title: true, image: true } });

  console.log(`Seeding valid images for ${staff.length} staff records in PostgreSQL...`);

  for (const s of staff) {
    let img = s.image;
    const titleLower = s.title.toLowerCase();

    if (titleLower.includes('polla')) {
      img = '/images/staff/polla.png';
    } else if (titleLower.includes('samir')) {
      img = '/images/staff/samir.png';
    } else if (
      titleLower.includes('sara') ||
      titleLower.includes('suhad') ||
      titleLower.includes('treska') ||
      titleLower.includes('fenk') ||
      titleLower.includes('shawnim') ||
      titleLower.includes('shakar')
    ) {
      img = '/images/staff/avatar-female-1.svg';
    } else {
      img = '/images/staff/avatar-male-1.svg';
    }

    await prisma.staff.update({
      where: { id: s.id },
      data: { image: img }
    });
  }

  console.log('SUCCESS: Updated all staff records with valid researcher photo/avatar paths!');
}

main().finally(() => prisma.$disconnect());
