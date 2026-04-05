import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasRole } from '../../../../lib/auth';
import { UserService } from '../../../../services/user.service';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user || !hasRole(user, ['Admin'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    const updatedUser = await UserService.updateUser(id, await req.json());
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    if (error?.code === 'P2025') return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ error: 'Bad Request', details: error.errors }, { status: 400 });
  }
}
