const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/receivers', (req, res) => {
    const sql = `
        SELECT DISTINCT t.receiver_id AS id, u.username
        FROM finance.transactions t
                 JOIN user.users u ON t.receiver_id = u.id
        ORDER BY u.username;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('DB error in /receivers:', err);
            return res.status(500).json({ message: 'DB error' });
        }

        res.json({ receivers: results });
    });
});

module.exports = router;