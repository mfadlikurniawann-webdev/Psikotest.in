import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ExamTaker from './ExamTaker';

export default async function PsikotesExamPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  // 1. Check if there's an in_progress session
  let sessions = await sql`
    SELECT * FROM test_sessions
    WHERE user_id = ${user.id} AND test_type = 'psikotes' AND status = 'in_progress'
    LIMIT 1
  `;

  let session = sessions[0];

  if (!session) {
    // Check if they completed it
    const completedSessions = await sql`
      SELECT * FROM test_sessions
      WHERE user_id = ${user.id} AND test_type = 'psikotes' AND status = 'completed'
      LIMIT 1
    `;
    if (completedSessions.length > 0) {
      redirect('/candidate/dashboard');
    }

    // Check if disqualified
    const disqSessions = await sql`
      SELECT * FROM test_sessions
      WHERE user_id = ${user.id} AND test_type = 'psikotes' AND status = 'disqualified'
      LIMIT 1
    `;
    if (disqSessions.length > 0) {
      redirect('/candidate/dashboard');
    }

    // Create session
    const inserted = await sql`
      INSERT INTO test_sessions (user_id, test_type, status, total_questions, started_at)
      VALUES (${user.id}, 'psikotes', 'in_progress', 100, NOW())
      RETURNING *
    `;
    session = inserted[0];
  }

  // 2. Query questions
  const questions = await sql`
    SELECT id, test_type, category, question, options, correct_answer, "order"
    FROM test_questions
    WHERE test_type = 'psikotes' AND is_active = true
    ORDER BY "order" ASC
  `;

  return <ExamTaker session={session} questions={questions} />;
}
