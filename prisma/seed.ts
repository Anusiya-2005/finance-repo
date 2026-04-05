import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.record.deleteMany({});
  await prisma.user.deleteMany({});

  const admin = await prisma.user.create({
    data: { name: 'Admin User', role: 'Admin', isActive: true }
  })
  const analyst = await prisma.user.create({
    data: { name: 'Analyst User', role: 'Analyst', isActive: true }
  })
  const viewer = await prisma.user.create({
    data: { name: 'Viewer User', role: 'Viewer', isActive: true }
  })

  const records = [
      { amount: 5000, type: 'INCOME', category: 'Salary', date: new Date('2023-01-01'), userId: admin.id },
      { amount: 150, type: 'EXPENSE', category: 'Groceries', date: new Date('2023-01-05'), userId: admin.id },
      { amount: 80, type: 'EXPENSE', category: 'Utilities', date: new Date('2023-01-10'), userId: admin.id },
      { amount: 1200, type: 'INCOME', category: 'Freelance', date: new Date('2023-01-15'), userId: analyst.id },
      { amount: 200, type: 'EXPENSE', category: 'Dining', date: new Date('2023-01-20'), userId: analyst.id },
  ];

  for (const record of records) {
    await prisma.record.create({ data: record });
  }

  console.log({ adminId: admin.id, analystId: analyst.id, viewerId: viewer.id })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
