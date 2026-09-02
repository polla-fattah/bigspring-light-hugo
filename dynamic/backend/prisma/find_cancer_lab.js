const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const labs = await prisma.lab.findMany({ select: { id: true, title: true, description: true } });
  console.log('Registered Core Laboratories in PostgreSQL:\n');
  labs.forEach(l => console.log(`[${l.id}] ${l.title}`));

  // Check or create Cancer Biology Laboratory
  let cancerLab = labs.find(l => l.title.toLowerCase().includes('cancer') || l.id.includes('cancer'));
  
  const cancerLabData = {
    title: 'Cancer Biology Laboratory',
    shortName: 'CBL',
    location: 'Building B, 2nd Floor, Room 204',
    locationName: 'Research Center Main Campus, Erbil',
    department: 'molecular-engineering-and-cancer-biology',
    departmentName: 'Molecular Engineering & Cancer Biology Unit',
    category: 'Biomedical Sciences',
    categoryName: 'Biomedical & Precision Oncology',
    description: 'The Cancer Biology Laboratory is equipped to support multidisciplinary research in molecular oncology, cancer cell biology, tumor microenvironment, experimental therapeutics, and translational cancer research. The laboratory integrates advanced instrumentation, standardized workflows, and specialized research capabilities to support postgraduate education, collaborative research projects, translational studies, and innovative cancer research.',
    capacity: '25',
    status: 'ACTIVE',
    platforms: [
      'Cell Culture',
      'Molecular Biology',
      'Protein Analysis',
      'Cell Imaging',
      'Cancer Therapeutics & Drug Screening',
      'Biomarker Discovery',
      'Experimental Oncology',
      'Sample Processing & Biobanking'
    ]
  };

  if (cancerLab) {
    console.log(`\nUpdating existing Cancer Biology Lab record [${cancerLab.id}]...`);
    await prisma.lab.update({
      where: { id: cancerLab.id },
      data: cancerLabData
    });
  } else {
    console.log(`\nCreating new Cancer Biology Lab record [cancer-biology-laboratory]...`);
    await prisma.lab.create({
      data: {
        id: 'cancer-biology-laboratory',
        ...cancerLabData
      }
    });
  }

  console.log('\nSUCCESS: Cancer Biology Laboratory updated in PostgreSQL!');
}

main().finally(() => prisma.$disconnect());
