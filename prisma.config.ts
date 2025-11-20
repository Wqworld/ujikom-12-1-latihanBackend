// Ganti import menjadi require
const { defineConfig, env } = require("prisma/config");
require("dotenv/config");

// Ganti export default menjadi module.exports
module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});