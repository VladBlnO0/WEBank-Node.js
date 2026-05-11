import express from "express";

const pool = require("../../db");
const servicesRoute = express.Router();

servicesRoute.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM db.services");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

export default servicesRoute;
