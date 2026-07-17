const sqlite3 = require("sqlite3").verbose();

// Open a persistent database file
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    // Create table if it does not exist
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )`,
      (err) => {
        if (err) console.error("Table creation error:", err.message);
      },
    );
  }
});

module.exports = db;
