import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import HRCandidatesClient from './HRCandidatesClient';
import { redirect } from 'next/navigation';

export default async function HRCandidatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const posRows = await sql`SELECT DISTINCT position_applied FROM users WHERE role='candidate' AND position_applied IS NOT NULL AND position_applied != '' ORDER BY position_applied ASC`;

  const candidates = await sql`
    SELECT u.id, u.name, u.email, u.position_applied, u.education,
           json_agg(json_build_object('status', ts.status, 'score', ts.score, 'personality_type', ts.personality_type)) FILTER (WHERE ts.id IS NOT NULL) as sessions
    FROM users u
    LEFT JOIN test_sessions ts ON ts.user_id = u.id AND ts.test_type = 'psikotes'
    WHERE u.role = 'candidate'
    GROUP BY u.id
    ORDER BY u.id DESC
  `;

  return <HRCandidatesClient user={user} candidates={candidates} positions={posRows.map(p=>p.position_applied)} />;
}
