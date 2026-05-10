const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/paymentsPost', (req, res) => {
    const { senderAccountNumber, amount, services } = req.body;

    if (!senderAccountNumber || !amount || !services || !Array.isArray(services) || services.length === 0) {
        return res.status(400).json({ message: "Invalid request" });
    }

    db.query(
        'SELECT id, balance FROM user.accounts WHERE number = ?', [senderAccountNumber],
        (err, senderResults) => {
            if (err || senderResults.length === 0) {
                return res.status(404).json({ message: 'Sender account not found' });
            }
            const senderId = senderResults[0].id;
            let senderBalance = parseFloat(senderResults[0].balance);

            if (senderBalance < amount) {
                return res.status(400).json({ message: "Insufficient funds" });
            }

            function processService(index) {
                if (index >= services.length) {
                    db.query(
                        'UPDATE user.accounts SET balance = balance - ? WHERE id = ?',
                        [amount, senderId],
                        (err4) => {
                            if (err4) {
                                console.error('Sender balance update error:', err4);
                                return res.status(500).json({ message: 'Failed to update sender balance' });
                            }
                            return res.json({ message: "Payments successful" });
                        }
                    );
                    return;
                }

                const { service_id } = services[index];

                db.query(
                    `UPDATE finance.payments p JOIN user.accounts a ON p.account_id = a.id
                     SET p.status = 1, p.payment_date = NOW()
                     WHERE a.number = ?
                       AND p.service_id = ?
                       AND p.status = 0`,
                    [senderAccountNumber, service_id],
                    (err2) => {
                        if (err2) {
                            console.error('Payment update error:', err2);
                            return res.status(500).json({ message: 'Failed to update payment'});
                        }
                        processService(index + 1);
                    }
                );
            }
            processService(0);
        }
    );
});

module.exports = router;
