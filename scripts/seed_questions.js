const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

const loadEnv = () => {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split('\n').forEach(line => {
      const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
      if (parts) {
        let val = (parts[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.substring(1, val.length - 1);
        process.env[parts[1]] = val;
      }
    });
  }
};
loadEnv();

const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const { DB_HOST: h, DB_PORT: p = '5432', DB_DATABASE: d, DB_USERNAME: u, DB_PASSWORD: pw } = process.env;
  if (!h) throw new Error('DB_HOST missing');
  return `postgresql://${u}:${pw}@${h}:${p}/${d}?sslmode=require`;
};

const sql = postgres(getDatabaseUrl(), { ssl: 'require' });

// Load question modules
const cogLogika = require('./questions/cognitive_logika');
const cogVerbal = require('./questions/cognitive_verbal');
const cogSpasial = require('./questions/cognitive_spasial');
const persEpps = require('./questions/personality_epps');
const persMbti = require('./questions/personality_mbti');
const persDisc = require('./questions/personality_disc');

async function seed() {
  console.log('=== Seeding Psikotest Questions ===\n');

  // Clear existing questions
  await sql`TRUNCATE TABLE test_questions RESTART IDENTITY CASCADE`;
  console.log('Cleared existing questions.\n');

  let order = 0;
  let total = 0;

  // Helper
  const insert = async (testType, category, items) => {
    for (const item of items) {
      order++;
      const opts = JSON.stringify(item.o);
      await sql`
        INSERT INTO test_questions (test_type, category, question, options, correct_answer, "order")
        VALUES (${testType}, ${category}, ${item.q}, ${opts}, ${item.a}, ${order})
      `;
      total++;
    }
    console.log(`  ✓ ${category}: ${items.length} soal (order ${order - items.length + 1}-${order})`);
  };

  // 1. Cognitive tests
  console.log('Tes Kognitif:');
  await insert('cognitive', 'logika_aritmatika', cogLogika);
  await insert('cognitive', 'verbal', cogVerbal);
  await insert('cognitive', 'spasial', cogSpasial);

  // 2. Personality tests
  console.log('\nTes Kepribadian:');
  await insert('personality', 'epps', persEpps);
  await insert('personality', 'mbti', persMbti);
  await insert('personality', 'disc', persDisc);

  console.log(`\nTotal ${total} soal berhasil di-seed!`);
  console.log('\nBreakdown:');
  console.log('  Kognitif: 75 soal (Logika 25 + Verbal 25 + Spasial 25)');
  console.log('  Kepribadian: 90 soal (EPPS 30 + MBTI 30 + DISC 30)');
  console.log('  Grafis: Canvas-based (no questions needed)');
  console.log('  Kraepelin: Auto-generated at runtime');

  await sql.end();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
