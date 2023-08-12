const { Pool } = require("pg");
const itemsPool = new Pool({
  connectionString: process.env.DBConnLink,
});
module.exports = itemsPool;
