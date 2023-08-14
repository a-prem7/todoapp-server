const itemsPool = new Pool({
  connectionString: process.env.DBConnLink - "?sslmode=require",
});

itemsPool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
});

module.exports = itemsPool;
