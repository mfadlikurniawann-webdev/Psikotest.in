import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import KraepelinExam from './KraepelinExam';

export default async function KraepelinExamPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.position_applied) redirect('/candidate/dashboard');

  let sessions = await sql`
    SELECT * FROM test_sessions WHERE user_id = ${user.id} AND module = 'kraepelin' AND status = 'in_progress' LIMIT 1
  `;
  let session = sessions[0];

  if (!session) {
    const completed = await sql`SELECT * FROM test_sessions WHERE user_id = ${user.id} AND module = 'kraepelin' AND status = 'completed' LIMIT 1`;
    if (completed.length > 0) redirect('/candidate/dashboard');

    const inserted = await sql`
      INSERT INTO test_sessions (user_id, test_type, module, status, total_questions, started_at, position_applied)
      VALUES (${user.id}, 'kraepelin', 'kraepelin', 'in_progress', 50, NOW(), ${user.position_applied})
      RETURNING *
    `;
    session = inserted[0];
  }

  return <KraepelinExam session={session} />;
}
