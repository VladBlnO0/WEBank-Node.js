const express = require("express");
const router = express.Router();
const db = require("../../../db");

router.get("/services", async (req, res) => {
  const servicesDataSql = `
        SELECT s.name, 
               s.icon,
               s.provider,
               s.tariff,
               s.id
        FROM finance.services s
    `;

  try {
    db.query(servicesDataSql, (err2, servicesData) => {
      if (err2) {
        console.error("services query error:", err2);
        return res.status(500).json({ message: "Service data error" });
      }
      res.json({
        servicesData,
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
