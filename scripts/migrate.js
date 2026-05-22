const fs = require('fs');
const path = require('path');
const postgres = require('postgres');
const bcrypt = require('bcryptjs');

// 1. Load env variables manually from .env file
const loadEnv = () => {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split('\n').forEach(line => {
      const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
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

let sql = postgres(getDatabaseUrl(), { ssl: 'require' });

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

    // New tables for comprehensive psikotes
    await sql`
      CREATE TABLE IF NOT EXISTS graphic_submissions (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
        test_subtype VARCHAR(50) NOT NULL,
        image_data TEXT NOT NULL,
        metadata JSONB,
        hr_score INTEGER,
        hr_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS kraepelin_results (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,
        row_number INTEGER NOT NULL,
        answers JSONB NOT NULL,
        correct_count INTEGER DEFAULT 0,
        total_count INTEGER DEFAULT 0,
        time_ms INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    console.log('Verifying columns...');
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS gender VARCHAR(50)
    `;
    await sql`
      ALTER TABLE test_sessions 
      ADD COLUMN IF NOT EXISTS hr_status VARCHAR(50) DEFAULT 'unreviewed',
      ADD COLUMN IF NOT EXISTS hr_notes TEXT,
      ADD COLUMN IF NOT EXISTS position_applied VARCHAR(255)
    `;
    // New column for multi-module test architecture
    await sql`
      ALTER TABLE test_sessions
      ADD COLUMN IF NOT EXISTS module VARCHAR(50)
    `;

    // Recreate connection to avoid cached plan issues after ALTER TABLE
    await sql.end();
    sql = postgres(getDatabaseUrl(), { ssl: 'require' });

    console.log('Tables verified successfully.');

    // 3. Seed Default HR user if none exists
    const hrUsers = await sql`SELECT id FROM users WHERE role = 'hr' LIMIT 1`;
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

    console.log('Migration & Seeding finished successfully!');
    console.log('Run "node scripts/seed_questions.js" to seed all test questions.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed with error:', err);
    process.exit(1);
  }
}

run();
