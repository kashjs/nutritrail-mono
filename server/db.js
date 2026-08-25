const { Pool, types } = require('pg');

types.setTypeParser(1700, value => (value === null ? null : parseFloat(value)));

types.setTypeParser(1114, value => value);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

module.exports = pool;