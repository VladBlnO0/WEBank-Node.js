import express from "express";

const pool = require("../../db");
const receiversRoute = express.Router();

receiversRoute.get("/receivers", async (req, res) => {
  const sql = `
        SELECT DISTINCT t.receiver_id AS id, u.username
        FROM db.transactions t
                    JOIN db.users u ON t.receiver_id = u.id
        ORDER BY u.username;
    `;

  try {
    const [rows] = await pool.query(sql, [req.query.number]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

export default receiversRoute;
