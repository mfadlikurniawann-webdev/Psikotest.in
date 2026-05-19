import sql from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import HRDashboardClient from './HRDashboardClient';

export default async function HRDashboardPage() {
  const user = await getCurrentUser();

  // 1. Fetch Stats
  const totalCandidatesRes = await sql`
    SELECT COUNT(*)::int as count FROM users WHERE role = 'candidate'
  `;
  const totalSessionsRes = await sql`
    SELECT COUNT(*)::int as count FROM test_sessions WHERE test_type = 'psikotes'
  `;
  const completedRes = await sql`
    SELECT COUNT(*)::int as count FROM test_sessions WHERE test_type = 'psikotes' AND status = 'completed'
  `;
  const disqualifiedRes = await sql`
    SELECT COUNT(*)::int as count FROM test_sessions WHERE test_type = 'psikotes' AND status = 'disqualified'
  `;
  const avgIqRes = await sql`
    SELECT AVG(score)::float as avg FROM test_sessions WHERE test_type = 'psikotes' AND status = 'completed'
  `;

  const stats = {
    total_candidates: totalCandidatesRes[0]?.count || 0,
    total_sessions: totalSessionsRes[0]?.count || 0,
    completed: completedRes[0]?.count || 0,
    disqualified: disqualifiedRes[0]?.count || 0,
    avg_iq: avgIqRes[0]?.avg || 0,
  };

  // 2. Fetch Recent Sessions
  const recentSessions = await sql`
    SELECT ts.*, u.name as user_name, u.position_applied
    FROM test_sessions ts
    JOIN users u ON ts.user_id = u.id
    WHERE ts.test_type = 'psikotes'
    ORDER BY ts.id DESC
    LIMIT 10
  `;

  // 3. Fetch Score Distribution
  const distLessThan90 = await sql`
    SELECT COUNT(*)::int as count FROM test_sessions 
    WHERE test_type = 'psikotes' AND status = 'completed' AND score < 90
  `;
  const dist90to109 = await sql`
    SELECT COUNT(*)::int as count FROM test_sessions 
    WHERE test_type = 'psikotes' AND status = 'completed' AND score >= 90 AND score <= 109
  `;
  const dist110to119 = await sql`
    SELECT COUNT(*)::int as count FROM test_sessions 
    WHERE test_type = 'psikotes' AND status = 'completed' AND score >= 110 AND score <= 119
  `;
  const dist120to129 = await sql`
    SELECT COUNT(*)::int as count FROM test_sessions 
    WHERE test_type = 'psikotes' AND status = 'completed' AND score >= 120 AND score <= 129
  `;
  const dist130Plus = await sql`
    SELECT COUNT(*)::int as count FROM test_sessions 
    WHERE test_type = 'psikotes' AND status = 'completed' AND score >= 130
  `;

  const scoreDistribution = {
    '< 90': distLessThan90[0]?.count || 0,
    '90-109': dist90to109[0]?.count || 0,
    '110-119': dist110to119[0]?.count || 0,
    '120-129': dist120to129[0]?.count || 0,
    '130+': dist130Plus[0]?.count || 0,
  };

  return (
    <HRDashboardClient
      user={user}
      stats={stats}
      recentSessions={recentSessions}
      scoreDistribution={scoreDistribution}
    />
  );
}
