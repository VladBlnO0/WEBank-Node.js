import { schedule } from "node-cron";

const pool = require("../../db");

schedule("0 0 * * *", async () => {
  const connection = await pool.getConnection();
  try {
    const accounts = await connection.query(
      `
        SELECT p.account_id, p.service_id, s.tariff
        FROM db.payments p
                    JOIN db.services s ON p.service_id = s.id
        WHERE p.due_date = CURDATE()
            AND p.status = true
    `,
    );

    for (const row of accounts) {
      const nextDue = new Date();
      nextDue.setMonth(nextDue.getMonth() + 1);
      await connection.query(
        `
            INSERT INTO db.payments (account_id, service_id, due_date, amount_due)
            VALUES (?, ?, ?, ?)
        `,
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
  } finally {
    connection.release();
  }
});
