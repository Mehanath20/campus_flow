const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:Mehanath@2006@db.jczzeeebpcpkmmivyvax.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function runSchema() {
  try {
    await client.connect();
    const schema = fs.readFileSync('./schema_attendance.sql', 'utf8');
    await client.query(schema);
    console.log('✅ Schema executed successfully!');
  } catch (err) {
    console.error('❌ Error executing schema:', err);
  } finally {
    await client.end();
  }
}

runSchema();
