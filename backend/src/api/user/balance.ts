import express from "express";

const pool = require("../../db");
const balanceRoute = express.Router();

balanceRoute.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM db.accounts WHERE id = ?`, [
      req.query.number,
    ]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

export default balanceRoute;
