// Test repositories
require('dotenv').config();

const { getPool } = require('../dist/config/database');
const { keytableRepository } = require('../dist/repositories/keytable.repository');
const { vereinRepository } = require('../dist/repositories/verein.repository');
const { mitgliedRepository } = require('../dist/repositories/mitglied.repository');

async function testRepositories() {
  try {
    console.log('=== Testing Repositories ===\n');

    // Test 1: Keytable Repository
    console.log('1. Testing Keytable Repository...');
    const mitgliedStatus = await keytableRepository.getKeytable('MitgliedStatus', 'de');
    console.log(`   ✅ MitgliedStatus: ${mitgliedStatus.length} items`);
    if (mitgliedStatus.length > 0) {
      console.log(`   Sample: ${JSON.stringify(mitgliedStatus[0])}`);
    }

    // Test 2: Verein Repository
    console.log('\n2. Testing Verein Repository...');
    const vereine = await vereinRepository.findAll();
    console.log(`   ✅ Vereine: ${vereine.length} items`);
    if (vereine.length > 0) {
      const vereinDetail = await vereinRepository.findByIdWithRelations(vereine[0].Id);
      console.log(`   First Verein: ${vereinDetail?.Name || 'N/A'}`);
    }

    // Test 3: Mitglied Repository
    console.log('\n3. Testing Mitglied Repository...');
    const mitglieder = await mitgliedRepository.findFiltered({ pageSize: 5 }, 'de');
    console.log(`   ✅ Mitglieder: ${mitglieder.totalCount} total, ${mitglieder.items.length} fetched`);
    if (mitglieder.items.length > 0) {
      const m = mitglieder.items[0];
      console.log(`   First Member: ${m.vorname} ${m.nachname} (${m.mitgliedStatusName || 'no status'})`);
    }

    console.log('\n=== All Tests Passed! ===\n');

    // Close pool
    const pool = await getPool();
    await pool.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testRepositories();

