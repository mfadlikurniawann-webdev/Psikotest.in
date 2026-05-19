const fs = require('fs');
const path = require('path');
const postgres = require('postgres');
const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');

// 1. Load env variables manually from .env file
const loadEnv = () => {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split('\n').forEach(line => {
      const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (parts) {
        const key = parts[1];
        let val = parts[2] || '';
        val = val.trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    });
  }
};

loadEnv();

const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_DATABASE;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  if (!host) {
    throw new Error('DB_HOST environment variable is missing.');
  }
  return `postgresql://${username}:${password}@${host}:${port}/${database}?sslmode=require`;
};

const sql = postgres(getDatabaseUrl(), { ssl: 'require' });

async function run() {
  console.log('Starting migration and seeding...');

  try {
    // 2. Create tables if they do not exist
    console.log('Verifying/Creating database tables...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'candidate',
        phone VARCHAR(50),
        position_applied VARCHAR(255),
        birth_date DATE,
        education VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        email_verified_at TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS test_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        test_type VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        score INTEGER,
        answers JSONB,
        result_detail JSONB,
        personality_type VARCHAR(255),
        total_questions INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        duration_seconds INTEGER,
        violation_count INTEGER DEFAULT 0,
        disqualify_reason VARCHAR(255),
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS test_violations (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
        type VARCHAR(50) DEFAULT 'TAB_SWITCH',
        detail VARCHAR(255),
        snapshot_path TEXT,
        occurred_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS test_questions (
        id SERIAL PRIMARY KEY,
        test_type VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        question TEXT NOT NULL,
        options JSONB NOT NULL,
        correct_answer INTEGER DEFAULT -1,
        "order" INTEGER DEFAULT 0,
        time_limit INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    console.log('Tables verified successfully.');

    // 3. Seed Default HR user if none exists
    const hrUsers = await sql`SELECT * FROM users WHERE role = 'hr' LIMIT 1`;
    if (hrUsers.length === 0) {
      console.log('No HR user found. Creating default HR account...');
      const defaultPassword = 'password';
      const hash = bcrypt.hashSync(defaultPassword, 10);
      await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('HR Administrator', 'admin@psikotest.in', ${hash}, 'hr')
      `;
      console.log(`Default HR created. Email: admin@psikotest.in | Password: ${defaultPassword}`);
    } else {
      console.log('HR user already exists.');
    }

    // 4. Extract Questions using PHP helper script
    console.log('Extracting questions from PHP seeder using scripts/extract.php...');
    let questionsJson;
    try {
      questionsJson = execSync('php scripts/extract.php', { encoding: 'utf8' });
    } catch (phpErr) {
      throw new Error('Failed to run php scripts/extract.php: ' + phpErr.message);
    }

    const questions = JSON.parse(questionsJson);
    console.log(`Successfully extracted ${questions.length} questions.`);

    if (questions.length > 0) {
      console.log('Clearing old questions and seeding new ones...');
      await sql`TRUNCATE TABLE test_questions RESTART IDENTITY CASCADE`;
      
      for (const q of questions) {
        // Ensure options is double-checked as valid json or format correctly
        // q.options is already stringified JSON in the PHP seeder's array mapping
        const optionsStr = typeof q.options === 'string' ? q.options : JSON.stringify(q.options);
        await sql`
          INSERT INTO test_questions (test_type, category, question, options, correct_answer, "order")
          VALUES (${q.test_type}, ${q.category}, ${q.question}, ${optionsStr}, ${q.correct_answer}, ${q.order})
        `;
      }
      console.log(`Successfully seeded ${questions.length} questions.`);
    }

    console.log('Migration & Seeding finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed with error:', err);
    process.exit(1);
  }
}

run();
