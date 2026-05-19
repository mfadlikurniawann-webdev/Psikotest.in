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

    const { sessionId, type, detail } = await req.json();

    // Verify session
    const sessions = await sql`
      SELECT id, violation_count FROM test_sessions
      WHERE id = ${sessionId} AND user_id = ${user.id} AND status = 'in_progress'
      LIMIT 1
    `;
    if (sessions.length === 0) {
      return NextResponse.json({ error: 'Active session not found' }, { status: 404 });
    }

    // Log the violation in test_violations table
    await sql`
      INSERT INTO test_violations (session_id, type, detail, occurred_at)
      VALUES (${sessionId}, ${type}, ${detail || ''}, NOW())
    `;

    // Increment violation count
    const updatedSessions = await sql`
      UPDATE test_sessions
      SET violation_count = violation_count + 1
      WHERE id = ${sessionId}
      RETURNING violation_count
    `;
    const newCount = updatedSessions[0].violation_count;

    let disqualified = false;
    if (newCount >= 3) {
      await sql`
        UPDATE test_sessions
        SET status = 'disqualified',
            disqualify_reason = ${`Melebihi batas pelanggaran (3x): ${type.replace('_', ' ')}`},
            completed_at = NOW()
        WHERE id = ${sessionId}
      `;
      disqualified = true;
    }

    return NextResponse.json({
      ok: true,
      violations: newCount,
      max_violations: 3,
      disqualified,
    });
  } catch (err) {
    console.error('Violation API Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
