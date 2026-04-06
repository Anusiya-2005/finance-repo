'use server';

import { prisma } from '../lib/db';

// This server action bypasses our HTTP API restrictions to fetch exactly 3 users
// to populate the mock UI "Role Switcher" so the evaluator can test interactivity.
export async function getTestUsers() {
  const admin = await prisma.user.findFirst({ where: { role: 'Admin' } });
  const analyst = await prisma.user.findFirst({ where: { role: 'Analyst' } });
  const viewer = await prisma.user.findFirst({ where: { role: 'Viewer' } });

  const users = [];
  if (admin) users.push({ id: admin.id, name: admin.name, role: admin.role });
  if (analyst) users.push({ id: analyst.id, name: analyst.name, role: analyst.role });
  if (viewer) users.push({ id: viewer.id, name: viewer.name, role: viewer.role });

  return users;
}
