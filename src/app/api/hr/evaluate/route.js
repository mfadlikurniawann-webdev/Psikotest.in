import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const token = cookies().get('auth_token')?.value;
    const user = await verifyToken(token);
    if (!user || user.role !== 'hr') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, hrStatus, hrNotes } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Verify session exists
    const sessions = await sql`
      SELECT id FROM test_sessions WHERE id = ${sessionId} LIMIT 1
    `;
    if (sessions.length === 0) {
      return NextResponse.json({ error: 'Sesi ujian tidak ditemukan' }, { status: 404 });
    }

    // Update the test session with HR evaluation details
    await sql`
      UPDATE test_sessions
      SET hr_status = ${hrStatus || 'unreviewed'},
          hr_notes = ${hrNotes || ''},
          updated_at = NOW()
      WHERE id = ${sessionId}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Evaluate API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
