import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasRole } from '../../../lib/auth';
import { RecordService } from '../../../services/record.service';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || !hasRole(user, ['Admin', 'Analyst', 'Viewer'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') as string | undefined;
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined;

  const records = await RecordService.getRecords({ userId: user.id, type, category, search, page, limit });
  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || !hasRole(user, ['Admin'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const payload = await req.json();
    payload.userId = user.id;
    const newRecord = await RecordService.createRecord(payload);
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Bad Request', details: error.errors }, { status: 400 });
  }
}
