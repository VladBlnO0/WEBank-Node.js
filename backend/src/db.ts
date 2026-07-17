import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function main() {
  const db = await open({
    filename: "../database.sqlite",
    driver: sqlite3.Database,
  });

  try {
    const rows = await db.all("SELECT * FROM users WHERE status = ?", [
      "active",
    ]);
    console.log(rows);
  } catch (error) {
    console.error("Database query failed:", error);
  } finally {
    await db.close();
  }
}

main();
