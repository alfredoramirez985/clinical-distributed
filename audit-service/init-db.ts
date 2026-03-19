import postgres from 'postgres';
const sql = postgres('postgresql://firstuser:firstuser@localhost:5432/postgres');
async function initDb() {
  try {
    const dbs = await sql`SELECT datname FROM pg_database WHERE datname = 'auditdb'`;
    if (dbs.length === 0) {
      await sql`CREATE DATABASE auditdb`;
      console.log('Database auditdb created successfully.');
    } else {
      console.log('Database auditdb already exists.');
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await sql.end();
  }
}
initDb();
