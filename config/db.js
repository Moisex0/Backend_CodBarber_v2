const { Pool } = require('pg');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

function sslOption() {
  if (!databaseUrl) return false;
  // Render, Neon, Supabase, etc. requieren TLS; Postgres local normalmente no.
  const needsSsl =
    process.env.NODE_ENV === 'production' ||
    /sslmode=require|ssl=true|render\.com|neon\.tech|supabase\.co/i.test(databaseUrl);
  return needsSsl ? { rejectUnauthorized: false } : false;
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: sslOption(),
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};