const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/sending', async (req, res) => {
    const { card, amount, description, senderAccountNumber } = req.body;

    if (!card || !amount || !senderAccountNumber) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        db.query(
            'SELECT id FROM user.accounts WHERE number = ?', [card],
            (err, receiverResults) => {
                if (err || receiverResults.length === 0) {
                    return res.status(404).json({ message: 'Receiver account not found' });
                }

                const receiverId = receiverResults[0].id;

                db.query(
                    'SELECT id FROM user.accounts WHERE number = ?', [senderAccountNumber],
                    (err2, senderResults) => {
                        if (err2 || senderResults.length === 0) {
                            return res.status(404).json({ message: 'Sender account not found' });
                        }

                        const senderId = senderResults[0].id;

                        db.query(
                            'INSERT INTO finance.transactions (sender_id, receiver_id, amount, description) VALUES (?, ?, ?, ?)',
                            [senderId, receiverId, amount, description || ''],
                            (err3) => {
                                if (err3) {
                                    console.error('Insert error:', err3);
                                    return res.status(500).json({ message: 'Transaction failed' });
                                }

                                db.query(
                                    'UPDATE user.accounts SET balance = balance - ? WHERE id = ?',
                                    [amount, senderId],
                                    (err4) => {
                                        if (err4) {
                                            console.error('Sender balance update error:', err4);
                                            return res.status(500).json({ message: 'Failed to update sender balance' });
                                        }
                                        db.query(
                                            'UPDATE user.accounts SET balance = balance + ? WHERE id = ?',
                                            [amount, receiverId],
                                            (err5) => {
                                                if (err5) {
                                                    console.error('Receiver balance update error:', err5);
                                                    return res.status(500).json({ message: 'Failed to update receiver balance' });
                                                }
                                                res.status(201).json({ message: 'Transaction completed successfully' });
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );

            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
