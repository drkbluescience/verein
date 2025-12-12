const sql = require('mssql');

const config = {
  server: 'Verein08112025.database.windows.net',
  port: 1433,
  database: 'VereinDB',
  user: 'vereinsa',
  password: ']L1iGfZJ*34iw9',
  options: { encrypt: true }
};

async function main() {
  try {
    await sql.connect(config);
    
    const result = await sql.query(`
      SELECT TABLE_SCHEMA, TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' 
      ORDER BY TABLE_SCHEMA, TABLE_NAME
    `);
    
    console.log('=== Database Tables ===\n');
    result.recordset.forEach(t => {
      console.log(`${t.TABLE_SCHEMA}.${t.TABLE_NAME}`);
    });
    
    await sql.close();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();

