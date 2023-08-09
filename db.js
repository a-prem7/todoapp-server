const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DBConfigLink,
  ssl: {
    rejectUnauthorized: false,
  },
});
module.exports = pool;
