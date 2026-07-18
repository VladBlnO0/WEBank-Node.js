import express from "express";

import { getDB } from "../../db";

const servicesRoute = express.Router();

servicesRoute.get("/", async (req, res) => {
  try {
    const db = getDB();

    const rows = await db.all("SELECT * FROM services");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

export default servicesRoute;
