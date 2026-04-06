import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();
async function run() {
  const admin = await prisma.user.findFirst({ where: { role: 'Admin' } });
  if (admin) {
    fs.writeFileSync('admin_id.txt', admin.id, 'utf8');
    console.log(admin.id);
  }
}
run();
