import express from "express";

import { getDB } from "../../db";

const paymentGetRoute = express.Router();

paymentGetRoute.get("/get", async (req, res) => {
  const paymentsDueDataSql = `
        SELECT id, 
               account_id,
               service_id,
               due_date,
               amount_due,
               status,
               payment_date
        FROM payments
        WHERE account_id = 1
    `;
  try {
    const db = getDB();

    const rows = await db.all(paymentsDueDataSql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

export default paymentGetRoute;
