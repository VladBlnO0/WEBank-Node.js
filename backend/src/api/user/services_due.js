const cron = require("node-cron");
const db = require("../../db");

cron.schedule("0 0 * * *", async () => {
    try {
        const accounts = await db.query(
            `SELECT p.account_id, p.service_id, s.tariff FROM payments p JOIN services s ON p.service_id = s.id
             WHERE p.due_date = CURDATE() AND p.status = true`,
        );

        for (const row of accounts) {
            let nextDue = new Date();
            nextDue.setMonth(nextDue.getMonth() + 1);
            await db.query(
                `INSERT INTO payments (account_id, service_id, due_date, amount_due)
                 VALUES (?, ?, ?, ?)`,
                [
                    row.account_id,
                    row.service_id,
                    nextDue.toISOString().slice(0, 10),
                    row.tariff,
                ],
            );
        }
    } catch (err) {
        console.error("Cron job failed:", err);
    }
});