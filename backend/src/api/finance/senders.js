const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/senders', (req, res) => {
    const sql = `
        SELECT DISTINCT t.sender_id AS id, u.username
        FROM finance.transactions t
                 JOIN user.users u ON t.sender_id = u.id
        ORDER BY u.username;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('DB error in /senders:', err);
            return res.status(500).json({ message: 'DB error' });
        }

        res.json({ senders: results });
    });
});

module.exports = router;