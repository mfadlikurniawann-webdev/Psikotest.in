const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

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
  console.log('Checking database columns for test_sessions...');
  try {
    // 1. Add position_applied column if it does not exist
    await sql`
      ALTER TABLE test_sessions 
      ADD COLUMN IF NOT EXISTS position_applied VARCHAR(255)
    `;
    console.log('Successfully verified/added position_applied column to test_sessions.');

    // 2. Backfill existing test_sessions position_applied from users table
    console.log('Backfilling position_applied for existing sessions...');
    await sql`
      UPDATE test_sessions ts
      SET position_applied = u.position_applied
      FROM users u
      WHERE ts.user_id = u.id AND ts.position_applied IS NULL
    `;
    console.log('Successfully backfilled existing sessions.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
