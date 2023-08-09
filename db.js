const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DBConnLink,
  host: process.env.Hostname,
  port: process.env.Port,
  ssl: {
    rejectUnauthorized: false,
  },
});
module.exports = pool;
