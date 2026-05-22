import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ExamTaker from './ExamTaker';

export default async function CognitiveExamPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.position_applied) redirect('/candidate/dashboard');

  // 1. Check if there's an in_progress session
  let sessions = await sql`
    SELECT * FROM test_sessions
    WHERE user_id = ${user.id} AND module = 'cognitive' AND status = 'in_progress'
    LIMIT 1
  `;
  let session = sessions[0];

  if (!session) {
    // Check if completed
    const completedSessions = await sql`
      SELECT * FROM test_sessions
      WHERE user_id = ${user.id} AND module = 'cognitive' AND status = 'completed'
      LIMIT 1
    `;
    if (completedSessions.length > 0) redirect('/candidate/dashboard');

    // Check if disqualified
    const disqSessions = await sql`
      SELECT * FROM test_sessions
      WHERE user_id = ${user.id} AND module = 'cognitive' AND status = 'disqualified'
      LIMIT 1
    `;
    if (disqSessions.length > 0) redirect('/candidate/dashboard');

    // Create new session
    const inserted = await sql`
      INSERT INTO test_sessions (user_id, test_type, module, status, total_questions, started_at, position_applied)
      VALUES (${user.id}, 'cognitive', 'cognitive', 'in_progress', 75, NOW(), ${user.position_applied})
      RETURNING *
    `;
    session = inserted[0];
  }

  // 2. Query cognitive questions
  const questions = await sql`
    SELECT id, test_type, category, question, options, correct_answer, "order"
    FROM test_questions
    WHERE test_type = 'cognitive' AND is_active = true
    ORDER BY "order" ASC
  `;

  return <ExamTaker session={session} questions={questions} module="cognitive" />;
}
