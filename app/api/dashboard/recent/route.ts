import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasRole } from '../../../../lib/auth';
import { DashboardService } from '../../../../services/dashboard.service';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || !hasRole(user, ['Admin', 'Analyst', 'Viewer'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const recent = await DashboardService.getRecent(user.id);
    return NextResponse.json(recent);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
