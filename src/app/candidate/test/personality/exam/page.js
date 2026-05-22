import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ExamTaker from '../../cognitive/exam/ExamTaker';

export default async function PersonalityExamPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.position_applied) redirect('/candidate/dashboard');

  let sessions = await sql`
    SELECT * FROM test_sessions WHERE user_id = ${user.id} AND module = 'personality' AND status = 'in_progress' LIMIT 1
  `;
  let session = sessions[0];

  if (!session) {
    const completed = await sql`SELECT * FROM test_sessions WHERE user_id = ${user.id} AND module = 'personality' AND status = 'completed' LIMIT 1`;
    if (completed.length > 0) redirect('/candidate/dashboard');
    const disq = await sql`SELECT * FROM test_sessions WHERE user_id = ${user.id} AND module = 'personality' AND status = 'disqualified' LIMIT 1`;
    if (disq.length > 0) redirect('/candidate/dashboard');

    const inserted = await sql`
      INSERT INTO test_sessions (user_id, test_type, module, status, total_questions, started_at, position_applied)
      VALUES (${user.id}, 'personality', 'personality', 'in_progress', 90, NOW(), ${user.position_applied})
      RETURNING *
    `;
    session = inserted[0];
  }

  const questions = await sql`
    SELECT id, test_type, category, question, options, correct_answer, "order"
    FROM test_questions WHERE test_type = 'personality' AND is_active = true ORDER BY "order" ASC
  `;

  return <ExamTaker session={session} questions={questions} module="personality" />;
}
