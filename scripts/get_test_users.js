const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

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

async function getCandidates() {
  const candidates = await sql`
    SELECT u.id, u.name, u.email, u.role, ts.id as session_id, ts.status, ts.score, ts.hr_status
    FROM users u
    LEFT JOIN test_sessions ts ON ts.user_id = u.id
    ORDER BY u.id DESC
    LIMIT 20
  `;
  console.log(JSON.stringify(candidates, null, 2));
  process.exit(0);
}

getCandidates().catch(err => {
  console.error(err);
  process.exit(1);
});
