require('dotenv').config();
const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: { encrypt: true }
};

async function main() {
  await sql.connect(config);
  const result = await sql.query(`
    SELECT COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'Verein' AND TABLE_NAME = 'RechtlicheDaten'
  `);
  console.log('RechtlicheDaten columns:');
  result.recordset.forEach(c => console.log(`  - ${c.COLUMN_NAME}`));
  await sql.close();
}

main().catch(e => console.error(e.message));

