import express from "express";

import db from "../../db";

const servicesRoute = express.Router();

servicesRoute.get("/", async (req, res) => {
  try {
    const [rows] = await db.all("SELECT * FROM services");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

export default servicesRoute;
