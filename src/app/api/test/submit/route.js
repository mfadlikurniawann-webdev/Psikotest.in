import sql from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const token = cookies().get('auth_token')?.value;
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, answers, duration } = await req.json();

    // Verify session
    const sessions = await sql`
      SELECT * FROM test_sessions
      WHERE id = ${sessionId} AND user_id = ${user.id} AND status = 'in_progress'
      LIMIT 1
    `;
    if (sessions.length === 0) {
      return NextResponse.json({ error: 'Active session not found or already completed' }, { status: 404 });
    }

    const session = sessions[0];

    // Get all active questions for psikotes
    const questions = await sql`
      SELECT id, category, correct_answer, "order"
      FROM test_questions
      WHERE test_type = 'psikotes' AND is_active = true
      ORDER BY "order" ASC
    `;

    let correctCognitive = 0;
    const totalCognitive = 75; // Questions 1-75 are cognitive (verbal, numerik, logika)

    let verbalCorrect = 0;
    let numerikCorrect = 0;
    let logikaCorrect = 0;

    const personalityTraits = {
      integritas: 0,  // Questions 76-80 (category = 'integritas')
      kolaborasi: 0,  // Questions 81-85 (category = 'kolaborasi')
      kepemimpinan: 0, // Questions 86-90 (category = 'kepemimpinan')
      stabilitas: 0,   // Questions 91-95 (category = 'stabilitas')
      ketelitian: 0    // Questions 96-100 (category = 'ketelitian')
    };

    const personalityCounts = {
      integritas: 0,
      kolaborasi: 0,
      kepemimpinan: 0,
      stabilitas: 0,
      ketelitian: 0
    };

    questions.forEach((q, idx) => {
      // User's selected option index (0 to N) for this question
      const userAns = answers[idx] !== undefined ? answers[idx] : null;

      if (idx < 75) {
        // Cognitive Evaluation
        const isCorrect = (userAns !== null && parseInt(userAns) === parseInt(q.correct_answer));
        if (isCorrect) {
          correctCognitive++;
          if (idx < 25) {
            verbalCorrect++;
          } else if (idx < 50) {
            numerikCorrect++;
          } else {
            logikaCorrect++;
          }
        }
      } else {
        // Personality Evaluation (Likert scale 1-4)
        // If not answered, default to 2 (Kurang Sesuai)
        const score = userAns !== null ? (parseInt(userAns) + 1) : 2;
        const category = q.category; // e.g. integritas, kolaborasi

        if (personalityTraits[category] !== undefined) {
          personalityTraits[category] += score;
          personalityCounts[category]++;
        }
      }
    });

    // IQ calculation (base 70, max correct 75, range 70 to 140)
    const iq = 70 + Math.round((correctCognitive / totalCognitive) * 70);

    // IQ Classification
    let classification = 'Rata-rata';
    if (iq >= 130) {
      classification = 'Sangat Superior';
    } else if (iq >= 120) {
      classification = 'Superior';
    } else if (iq >= 110) {
      classification = 'Rata-rata Atas';
    } else if (iq >= 90) {
      classification = 'Rata-rata';
    } else if (iq >= 80) {
      classification = 'Rata-rata Bawah';
    } else {
      classification = 'Batas Lambat Belajar';
    }

    // Personality percentage calculation (Max score per category = count * 4)
    const personalityResult = {};
    for (const trait in personalityTraits) {
      const maxScore = (personalityCounts[trait] || 5) * 4;
      personalityResult[trait] = Math.round((personalityTraits[trait] / maxScore) * 100);
    }

    // Complete result details structure matching PHP side
    const resultDetail = {
      iq,
      classification,
      verbal: {
        correct: verbalCorrect,
        total: 25,
        score: Math.round((verbalCorrect / 25) * 100)
      },
      numerik: {
        correct: numerikCorrect,
        total: 25,
        score: Math.round((numerikCorrect / 25) * 100)
      },
      logika: {
        correct: logikaCorrect,
        total: 25,
        score: Math.round((logikaCorrect / 25) * 100)
      },
      kepribadian: personalityResult
    };

    // Update test session
    await sql`
      UPDATE test_sessions
      SET status = 'completed',
          answers = ${JSON.stringify(answers)},
          score = ${iq},
          result_detail = ${JSON.stringify(resultDetail)},
          personality_type = ${classification},
          correct_answers = ${correctCognitive},
          duration_seconds = ${duration},
          completed_at = NOW()
      WHERE id = ${sessionId}
    `;

    return NextResponse.json({
      ok: true,
      sessionId,
      score: iq,
      classification
    });
  } catch (err) {
    console.error('Submit API Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
