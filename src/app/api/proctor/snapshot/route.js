import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const token = cookies().get('auth_token')?.value;
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, image } = await req.json();
    if (!image) {
      return NextResponse.json({ ok: false, error: 'No image data provided' }, { status: 400 });
    }

    // Verify session belongs to user and is in progress
    const sessions = await sql`
      SELECT id FROM test_sessions 
      WHERE id = ${sessionId} AND user_id = ${user.id} AND status = 'in_progress'
      LIMIT 1
    `;
    if (sessions.length === 0) {
      return NextResponse.json({ error: 'Active session not found' }, { status: 404 });
    }

    // Save snapshot in test_violations as 'SNAPSHOT' type
    await sql`
      INSERT INTO test_violations (session_id, type, detail, snapshot_path, occurred_at)
      VALUES (${sessionId}, 'SNAPSHOT', 'Periodic proctoring capture', ${image}, NOW())
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Snapshot API Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
