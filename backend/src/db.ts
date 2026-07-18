import sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

async function initDB(): Promise<
  Database<sqlite3.Database, sqlite3.Statement>
> {
  if (!dbInstance) {
    dbInstance = await open({
      filename: "../database.sqlite",
      driver: sqlite3.Database,
    });
  }
  return dbInstance;
}

function getDB(): Database<sqlite3.Database, sqlite3.Statement> {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call initDB() first.");
  }
  return dbInstance;
}

export { initDB, getDB };
