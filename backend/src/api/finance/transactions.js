const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = 'SELECT * FROM finance.transactions WHERE sender_id = ? ORDER BY date DESC';

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'DB error' });

        res.json({ transactions: results });
    });
});

module.exports = router;
