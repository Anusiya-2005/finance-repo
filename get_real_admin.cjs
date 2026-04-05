const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const admin = await prisma.user.findFirst({ where: { role: 'Admin' } });
  require('fs').writeFileSync('admin_id.txt', admin.id, 'utf8');
}
run();
