const db = require('../database');

(async () => {
  try {
    const [tables] = await db.query('SHOW TABLES');
    const tableKey = Object.keys(tables[0])[0];
    for (const t of tables) {
      const name = t[tableKey];
      const [rows] = await db.query(`SHOW INDEX FROM \`${name}\``);
      const seen = new Set();
      const toDrop = new Set();
      for (const r of rows) {
        if (r.Key_name === 'PRIMARY') continue;
        if (seen.has(r.Column_name)) toDrop.add(r.Key_name);
        else seen.add(r.Column_name);
      }
      if (toDrop.size > 0) {
        let dropped = 0;
        for (const idx of toDrop) {
          try {
            await db.query(`ALTER TABLE \`${name}\` DROP INDEX \`${idx}\``);
            dropped += 1;
          } catch (e) {
            console.log(`${name}: skipped ${idx} (${e.message})`);
          }
        }
        console.log(`${name}: dropped ${dropped}/${toDrop.size} duplicate indexes`);
      } else {
        console.log(`${name}: OK`);
      }
    }
    console.log('DONE');
  } catch (e) {
    console.log('ERR', e.message);
  } finally {
    await db.close();
  }
})();
