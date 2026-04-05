import { NextRequest } from 'next/server';
import { prisma } from './db';

// Extract mock user ID from header X-User-Id
export async function getCurrentUser(req: NextRequest) {
  const userId = req.headers.get('X-User-Id');
  if (!userId) return null;

  const user = await prisma.user.findFirst({
    where: { id: userId, isActive: true, deletedAt: null },
  });

  return user;
}

export function hasRole(user: any, allowedRoles: string[]) {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
