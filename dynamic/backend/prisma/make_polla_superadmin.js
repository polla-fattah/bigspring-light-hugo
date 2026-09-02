const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: 'polla.fattah@su.edu.krd' }
  });

  if (existing) {
    const updated = await prisma.user.update({
      where: { email: 'polla.fattah@su.edu.krd' },
      data: { role: 'superadmin' }
    });
    console.log('Successfully upgraded Dr. Polla Fattah to superadmin:', updated.email, updated.role);
  } else {
    console.log('User polla.fattah@su.edu.krd will receive superadmin role upon registration.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
