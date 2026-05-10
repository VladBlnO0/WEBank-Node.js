const express = require('express');
const router = express.Router();
const db = require("../../db");

router.get("/paymentsGet", async (req, res) => {

    const paymentsDueDataSql = `
        SELECT id, 
               account_id,
               service_id,
               due_date,
               amount_due,
               status,
               payment_date
        FROM finance.payments
    `;

    try {
        db.query(paymentsDueDataSql, (err2, paymentsDueData) => {
            if (err2) return res.status(500).json({ message: "Service data error" });
            res.json({
                paymentsDueData
            });
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
