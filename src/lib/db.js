import postgres from 'postgres';

const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_DATABASE;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  
  if (!host) {
    throw new Error('Database configuration (DB_HOST) missing in environment variables.');
  }
  
  // Format standard postgres connection URI
  return `postgresql://${username}:${password}@${host}:${port}/${database}?sslmode=require`;
};

let sql;

if (!global.postgresSql) {
  global.postgresSql = postgres(getDatabaseUrl(), {
    ssl: 'require',
    transform: {
      undefined: null
    }
  });
}
sql = global.postgresSql;

export default sql;
