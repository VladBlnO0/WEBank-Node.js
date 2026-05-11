import { Router } from 'express';
const router = Router();
import { query } from '../../db';

router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = 'SELECT * FROM finance.transactions WHERE sender_id = ? ORDER BY date DESC';

    query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'DB error' });

        res.json({ transactions: results });
    });
});

export default router;
