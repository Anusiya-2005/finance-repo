import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hasRole } from '../../../../lib/auth';
import { RecordService } from '../../../../services/record.service';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user || !hasRole(user, ['Admin'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    const updatedRecord = await RecordService.updateRecord(id, await req.json());
    return NextResponse.json(updatedRecord);
  } catch (error: any) {
    if (error?.code === 'P2025') return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    return NextResponse.json({ error: 'Bad Request', details: error.errors }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user || !hasRole(user, ['Admin'])) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    await RecordService.deleteRecord(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error?.code === 'P2025') return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
