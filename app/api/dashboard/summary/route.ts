import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasRole } from '../../../../lib/auth';
import { DashboardService } from '../../../../services/dashboard.service';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || !hasRole(user, ['Admin', 'Analyst', 'Viewer'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const summary = await DashboardService.getSummary(user.id);
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
