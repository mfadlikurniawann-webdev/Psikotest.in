import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const token = cookies().get('auth_token')?.value;
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { sessionId, answers, duration, module } = await req.json();

    const sessions = await sql`
      SELECT * FROM test_sessions WHERE id = ${sessionId} AND user_id = ${user.id} AND status = 'in_progress' LIMIT 1
    `;
    if (sessions.length === 0) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const session = sessions[0];
    const sessionModule = module || session.module || 'cognitive';

    if (sessionModule === 'cognitive') {
      return handleCognitive(sessionId, answers, duration, sql);
    } else if (sessionModule === 'personality') {
      return handlePersonality(sessionId, answers, duration, sql);
    }

    return NextResponse.json({ error: 'Unknown module' }, { status: 400 });
  } catch (err) {
    console.error('Submit API Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

async function handleCognitive(sessionId, answers, duration, sql) {
  const questions = await sql`
    SELECT id, category, correct_answer, "order" FROM test_questions
    WHERE test_type = 'cognitive' AND is_active = true ORDER BY "order" ASC
  `;

  let logikaCorrect = 0, verbalCorrect = 0, spasialCorrect = 0;

  questions.forEach((q, idx) => {
    const userAns = answers[idx] !== undefined ? answers[idx] : null;
    const isCorrect = userAns !== null && parseInt(userAns) === parseInt(q.correct_answer);
    if (isCorrect) {
      if (idx < 25) logikaCorrect++;
      else if (idx < 50) verbalCorrect++;
      else spasialCorrect++;
    }
  });

  const totalCorrect = logikaCorrect + verbalCorrect + spasialCorrect;
  const totalQuestions = 75;

  // IQ calculation
  const iq = 70 + Math.round(
    ((logikaCorrect / 25) * 0.35 + (verbalCorrect / 25) * 0.35 + (spasialCorrect / 25) * 0.30) * 70
  );

  let classification = 'Rata-rata';
  if (iq >= 130) classification = 'Sangat Superior';
  else if (iq >= 120) classification = 'Superior';
  else if (iq >= 110) classification = 'Rata-rata Atas';
  else if (iq >= 90) classification = 'Rata-rata';
  else if (iq >= 80) classification = 'Rata-rata Bawah';
  else classification = 'Batas Lambat Belajar';

  const resultDetail = {
    iq, classification,
    logika: { correct: logikaCorrect, total: 25, score: Math.round((logikaCorrect / 25) * 100) },
    verbal: { correct: verbalCorrect, total: 25, score: Math.round((verbalCorrect / 25) * 100) },
    spasial: { correct: spasialCorrect, total: 25, score: Math.round((spasialCorrect / 25) * 100) },
  };

  await sql`
    UPDATE test_sessions SET status = 'completed', answers = ${JSON.stringify(answers)},
      score = ${iq}, result_detail = ${JSON.stringify(resultDetail)},
      personality_type = ${classification}, correct_answers = ${totalCorrect},
      duration_seconds = ${duration}, completed_at = NOW()
    WHERE id = ${sessionId}
  `;

  return NextResponse.json({ ok: true, sessionId, score: iq, classification });
}

async function handlePersonality(sessionId, answers, duration, sql) {
  const questions = await sql`
    SELECT id, category, options, "order" FROM test_questions
    WHERE test_type = 'personality' AND is_active = true ORDER BY "order" ASC
  `;

  // MBTI scoring
  const mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  // DISC scoring
  const discScores = { D: 0, I: 0, S: 0, C: 0 };
  // EPPS trait scoring
  const eppsTraits = {};

  questions.forEach((q, idx) => {
    const userAns = answers[idx];
    if (userAns === undefined || userAns === null) return;

    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
    const selected = opts[userAns];
    if (!selected || typeof selected !== 'object') return;

    if (q.category === 'mbti' && selected.dim) {
      mbtiScores[selected.dim] = (mbtiScores[selected.dim] || 0) + 1;
    } else if (q.category === 'disc' && selected.dim) {
      discScores[selected.dim] = (discScores[selected.dim] || 0) + 1;
    } else if (q.category === 'epps' && selected.trait) {
      eppsTraits[selected.trait] = (eppsTraits[selected.trait] || 0) + 1;
    }
  });

  // Determine MBTI type
  const mbtiType = [
    mbtiScores.E >= mbtiScores.I ? 'E' : 'I',
    mbtiScores.S >= mbtiScores.N ? 'S' : 'N',
    mbtiScores.T >= mbtiScores.F ? 'T' : 'F',
    mbtiScores.J >= mbtiScores.P ? 'J' : 'P',
  ].join('');

  // DISC percentages
  const discTotal = Math.max(1, Object.values(discScores).reduce((a, b) => a + b, 0));
  const discProfile = {};
  for (const k in discScores) discProfile[k] = Math.round((discScores[k] / discTotal) * 100);

  // EPPS top traits
  const eppsSorted = Object.entries(eppsTraits).sort((a, b) => b[1] - a[1]);
  const eppsTop5 = eppsSorted.slice(0, 5).map(([trait, score]) => ({ trait, score }));

  const resultDetail = {
    mbti: { type: mbtiType, scores: mbtiScores },
    disc: { profile: discProfile, scores: discScores },
    epps: { traits: eppsTraits, top5: eppsTop5 },
  };

  await sql`
    UPDATE test_sessions SET status = 'completed', answers = ${JSON.stringify(answers)},
      result_detail = ${JSON.stringify(resultDetail)},
      personality_type = ${mbtiType},
      duration_seconds = ${duration}, completed_at = NOW()
    WHERE id = ${sessionId}
  `;

  return NextResponse.json({ ok: true, sessionId, mbtiType, discProfile });
}
