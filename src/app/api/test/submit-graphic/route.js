import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const token = cookies().get('auth_token')?.value;
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { sessionId, submissions } = await req.json();

    const sessions = await sql`
      SELECT * FROM test_sessions WHERE id = ${sessionId} AND user_id = ${user.id} AND status = 'in_progress' LIMIT 1
    `;
    if (sessions.length === 0) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    // Save each graphic submission
    for (const sub of submissions) {
      await sql`
        INSERT INTO graphic_submissions (session_id, test_subtype, image_data, metadata)
        VALUES (${sessionId}, ${sub.test_subtype}, ${sub.image_data}, ${JSON.stringify(sub.metadata || {})})
      `;
    }

    // Mark session as completed
    await sql`
      UPDATE test_sessions SET status = 'completed', completed_at = NOW(),
        result_detail = ${JSON.stringify({ type: 'graphic', submissions_count: submissions.length })}
      WHERE id = ${sessionId}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Graphic submit error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
