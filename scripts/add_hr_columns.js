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
  console.log('Checking database columns...');
  try {
    // Add hr_status and hr_notes columns if they do not exist
    await sql`
      ALTER TABLE test_sessions 
      ADD COLUMN IF NOT EXISTS hr_status VARCHAR(50) DEFAULT 'unreviewed',
      ADD COLUMN IF NOT EXISTS hr_notes TEXT
    `;
    console.log('Successfully verified/added hr_status and hr_notes columns.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
