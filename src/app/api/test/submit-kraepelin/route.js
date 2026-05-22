import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const token = cookies().get('auth_token')?.value;
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { sessionId, rowResults } = await req.json();

    const sessions = await sql`
      SELECT * FROM test_sessions WHERE id = ${sessionId} AND user_id = ${user.id} AND status = 'in_progress' LIMIT 1
    `;
    if (sessions.length === 0) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    // Save each row result
    for (const row of rowResults) {
      await sql`
        INSERT INTO kraepelin_results (session_id, row_number, answers, correct_count, total_count, time_ms)
        VALUES (${sessionId}, ${row.row_number}, ${JSON.stringify(row.answers)}, ${row.correct_count}, ${row.total_count}, ${row.time_ms})
      `;
    }

    // Calculate summary metrics
    const totalCorrect = rowResults.reduce((s, r) => s + r.correct_count, 0);
    const totalAnswered = rowResults.reduce((s, r) => s + r.total_count, 0);
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const avgPerRow = totalAnswered / Math.max(1, rowResults.length);
    
    // Consistency: standard deviation of correct_count per row
    const correctCounts = rowResults.map(r => r.correct_count);
    const mean = correctCounts.reduce((a, b) => a + b, 0) / Math.max(1, correctCounts.length);
    const variance = correctCounts.reduce((s, c) => s + Math.pow(c - mean, 2), 0) / Math.max(1, correctCounts.length);
    const stdDev = Math.round(Math.sqrt(variance) * 100) / 100;

    // Endurance: compare first half vs second half
    const half = Math.floor(rowResults.length / 2);
    const firstHalf = rowResults.slice(0, half).reduce((s, r) => s + r.correct_count, 0);
    const secondHalf = rowResults.slice(half).reduce((s, r) => s + r.correct_count, 0);
    const enduranceRatio = firstHalf > 0 ? Math.round((secondHalf / firstHalf) * 100) : 100;

    const resultDetail = {
      type: 'kraepelin',
      total_rows: rowResults.length,
      total_correct: totalCorrect,
      total_answered: totalAnswered,
      accuracy,
      avg_per_row: Math.round(avgPerRow * 10) / 10,
      consistency_stddev: stdDev,
      endurance_ratio: enduranceRatio,
    };

    await sql`
      UPDATE test_sessions SET status = 'completed', completed_at = NOW(),
        score = ${accuracy}, correct_answers = ${totalCorrect},
        result_detail = ${JSON.stringify(resultDetail)}
      WHERE id = ${sessionId}
    `;

    return NextResponse.json({ ok: true, accuracy, totalCorrect });
  } catch (err) {
    console.error('Kraepelin submit error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
