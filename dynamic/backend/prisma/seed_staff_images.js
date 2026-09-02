const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const staff = await prisma.staff.findMany({ select: { id: true, title: true, image: true } });

  console.log(`Setting standard user silhouette for staff records in PostgreSQL...`);

  for (const s of staff) {
    let img = s.image;
    const titleLower = s.title.toLowerCase();

    if (titleLower.includes('polla')) {
      img = '/images/staff/polla.png';
    } else if (titleLower.includes('samir')) {
      img = '/images/staff/samir.png';
    } else {
      img = '/images/staff/default-avatar.svg';
    }

    await prisma.staff.update({
      where: { id: s.id },
      data: { image: img }
    });
  }

  console.log('SUCCESS: Updated all staff records with standard user silhouette avatar path!');
}

main().finally(() => prisma.$disconnect());
