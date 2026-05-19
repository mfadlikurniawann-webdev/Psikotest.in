import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const token = cookies().get('auth_token')?.value;
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, 401);
    }

    const { sessionId } = await req.json();

    const sessions = await sql`
      SELECT status, violation_count, disqualify_reason FROM test_sessions
      WHERE id = ${sessionId} AND user_id = ${user.id}
      LIMIT 1
    `;
    if (sessions.length === 0) {
      return NextResponse.json({ status: 'unknown' });
    }

    const session = sessions[0];
    return NextResponse.json({
      status: session.status,
      violations: session.violation_count,
      disqualify_reason: session.disqualify_reason,
    });
  } catch (err) {
    return NextResponse.json({ status: 'error' }, 500);
  }
}
