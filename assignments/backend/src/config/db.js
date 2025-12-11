const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://dhinakaran_postgresql_user:V0PsAFHYYWVYE1stTMXwOJsfU5AdgTYu@dpg-d4t9ucchg0os73cpdvvg-a/dhinakaran_postgresql" ,
      ssl: { rejectUnauthorized: false }

});

module.exports = pool;
