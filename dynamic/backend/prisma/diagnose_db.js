const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnose() {
  console.log('====================================================');
  console.log('       SURC DATABASE DIAGNOSTIC REPORT              ');
  console.log('====================================================\n');

  try {
    const units = await prisma.researchUnit.count();
    const staff = await prisma.staff.count();
    const users = await prisma.user.count();
    const projects = await prisma.project.count();
    const publications = await prisma.publication.count();
    const labs = await prisma.lab.count();
    const events = await prisma.event.count();
    const datasets = await prisma.dataset.count();
    const regulations = await prisma.regulation.count();
    const forms = await prisma.form.count();

    console.log('✅ PostgreSQL Connection: SUCCESSFUL!');
    console.log('----------------------------------------------------');
    console.log(`📊 Research Units Count  : ${units}`);
    console.log(`📊 Staff Profiles Count  : ${staff}`);
    console.log(`📊 User Accounts Count   : ${users}`);
    console.log(`📊 Projects Count       : ${projects}`);
    console.log(`📊 Publications Count   : ${publications}`);
    console.log(`📊 Core Labs Count       : ${labs}`);
    console.log(`📊 Events Count         : ${events}`);
    console.log(`📊 Datasets Count       : ${datasets}`);
    console.log(`📊 Regulations Count    : ${regulations}`);
    console.log(`📊 Forms/Templates Count: ${forms}`);
    console.log('----------------------------------------------------');

    if (publications === 0 || staff === 0) {
      console.log('\n⚠️ WARNING: Database tables exist but have 0 rows! Running auto-seeder now...');
    } else {
      console.log('\n🎉 ALL TABLES POPULATED WITH LIVE DATA!');
    }
  } catch (err) {
    console.error('❌ DATABASE CONNECTION ERROR:');
    console.error(err.message);
  }
}

diagnose().finally(() => prisma.$disconnect());
