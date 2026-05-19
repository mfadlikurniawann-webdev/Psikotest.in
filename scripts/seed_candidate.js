const postgres = require('postgres');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const envPath = path.join(__dirname, '../.env');
const env = fs.readFileSync(envPath, 'utf8');
let dbUrl = '';
env.split('\n').forEach(line => {
  const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (parts && parts[1] === 'DATABASE_URL') {
    dbUrl = parts[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const sql = postgres(dbUrl, { ssl: 'require' });

async function seed() {
  console.log('Seeding mock candidate Annisa Putri Azzahra...');
  
  // Hash password
  const hash = bcrypt.hashSync('password', 10);
  
  // Check if candidate already exists
  const existing = await sql`SELECT * FROM users WHERE email = 'annisa@gmail.com' LIMIT 1`;
  let userId;
  
  if (existing.length > 0) {
    console.log('Candidate already exists. Reusing...');
    userId = existing[0].id;
  } else {
    const inserted = await sql`
      INSERT INTO users (name, email, password, role, position_applied, birth_date, education)
      VALUES (
        'Annisa Putri Azzahra', 
        'annisa@gmail.com', 
        ${hash}, 
        'candidate', 
        'Sanitasi Lingkungan', 
        '2002-03-23', 
        'D4 / Sarjana Terapan'
      )
      RETURNING id
    `;
    userId = inserted[0].id;
    console.log('Created candidate with ID:', userId);
  }

  // Delete previous test sessions for this candidate to prevent duplicates
  await sql`DELETE FROM test_sessions WHERE user_id = ${userId}`;

  // Insert completed test session
  const resultDetail = {
    iq: 98,
    classification: 'Rata-rata',
    verbal: { correct: 12, total: 25, score: 48 },
    numerik: { correct: 10, total: 25, score: 40 },
    logika: { correct: 11, total: 25, score: 44 },
    kepribadian: {
      integritas: 75,
      kolaborasi: 70,
      kepemimpinan: 65,
      stabilitas: 68,
      ketelitian: 72
    }
  };

  const session = await sql`
    INSERT INTO test_sessions (
      user_id, 
      test_type, 
      status, 
      score, 
      result_detail, 
      personality_type, 
      correct_answers, 
      duration_seconds,
      started_at,
      completed_at
    )
    VALUES (
      ${userId},
      'psikotes',
      'completed',
      98,
      ${JSON.stringify(resultDetail)},
      'Rata-rata',
      33,
      1800,
      '2025-03-23 08:00:00',
      '2025-03-23 09:00:00'
    )
    RETURNING id
  `;

  console.log('Created completed test session with ID:', session[0].id);
  console.log('Mock candidate seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
