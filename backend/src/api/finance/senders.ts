import express from "express";

import { getDB } from "../../db";

const sendersRoute = express.Router();

sendersRoute.get("/senders", async (req, res) => {
  const sql = `
      SELECT DISTINCT t.sender_id AS id, u.username
      FROM transactions t
               JOIN db.users u ON t.sender_id = u.id
      ORDER BY u.username;
  `;

  try {
    const db = getDB();

    const rows = await db.all(sql, [req.query.number]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

export default sendersRoute;
