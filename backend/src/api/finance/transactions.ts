import express from "express";

const pool = require("../../db");
const transactionsRoute = express.Router();

transactionsRoute.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM db.transactions WHERE sender_id = ? ORDER BY date DESC`,
      [req.query.sender_id],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

export default transactionsRoute;
