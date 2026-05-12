import "server-only";

import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getMySqlPool() {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not configured");
    }

    pool = mysql.createPool(databaseUrl);
  }

  return pool;
}
