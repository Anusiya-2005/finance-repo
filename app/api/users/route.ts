import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasRole } from '../../../lib/auth';
import { UserService } from '../../../services/user.service';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || !hasRole(user, ['Admin'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const users = await UserService.getAllUsers();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || !hasRole(user, ['Admin'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const newUser = await UserService.createUser(await req.json());
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Bad Request', details: error.errors }, { status: 400 });
  }
}
