import express from "express";

import db from "../../db";
const receiversRoute = express.Router();

receiversRoute.get("/receivers", async (req, res) => {
  const sql = `
        SELECT DISTINCT t.receiver_id AS id, u.username
        FROM transactions t
                    JOIN users u ON t.receiver_id = u.id
        ORDER BY u.username;
    `;

  try {
    const [rows] = await db.query(sql, [req.query.number]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

export default receiversRoute;
