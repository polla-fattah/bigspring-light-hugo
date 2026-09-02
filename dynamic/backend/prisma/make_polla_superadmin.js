const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.user.update({
    where: { email: 'polla.fattah@su.edu.krd' },
    data: { role: 'superadmin' }
  });
  console.log('Successfully upgraded Dr. Polla Fattah to superadmin:', updated.email, updated.role);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
