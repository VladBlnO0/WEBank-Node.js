import express from "express";

import { getDB } from "../../db";

const balanceRoute = express.Router();

balanceRoute.get("/", async (req, res) => {
  try {
    const db = getDB();

    const rows = await db.all(`SELECT * FROM accounts WHERE id = ?`, [1]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

export default balanceRoute;
