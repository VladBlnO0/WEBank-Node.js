import express from "express";

import { getDB } from "../../db";

const transactionsRoute = express.Router();

transactionsRoute.get("/", async (req, res) => {
  try {
    const db = getDB();

    const rows = await db.all(
      `SELECT * FROM transactions WHERE sender_id = ? ORDER BY date DESC`,
      [req.query.sender_id],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

export default transactionsRoute;
