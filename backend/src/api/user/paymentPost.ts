import express from "express";

const pool = require("../../db");
const paymentPostRoute = express.Router();

paymentPostRoute.post("/post", async (req, res) => {
  // const { senderAccountNumber, amount, services } = req.body;
  let senderAccountNumber: string, amount: number, services: any[];
  senderAccountNumber = "1234123412345234";
  amount = 5;
  services = [
    {
      service_id: 1,
    },
  ];

  if (
    !senderAccountNumber ||
    !amount ||
    !services ||
    !Array.isArray(services) ||
    services.length === 0
  ) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [senderResults]: any = await connection.query(
      "SELECT id, balance FROM db.accounts WHERE number = ?",
      [senderAccountNumber],
    );

    if (senderResults.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Sender account not found" });
    }

    const senderId = senderResults[0].id;
    const senderBalance = parseFloat(senderResults[0].balance);

    if (senderBalance < amount) {
      await connection.rollback();
      return res.status(400).json({ message: "Insufficient funds" });
    }

    for (const service of services) {
      const { service_id } = service;

      await connection.query(
        `
        UPDATE db.payments p
        JOIN db.accounts a ON p.account_id = a.id
        SET p.status       = 1,
            p.payment_date = NOW()
        WHERE a.number = ?
        AND p.service_id = ?
        AND p.status = 0
        `,
        [senderAccountNumber, service_id],
      );
    }

    await connection.query(
      "UPDATE db.accounts SET balance = balance - ? WHERE id = ?",
      [amount, senderId],
    );

    await connection.commit();
    res.json({ message: "Payments successful" });
  } catch (err) {
    await connection.rollback();
    console.error("Payment transaction error:", err);
    res.status(500).json({ message: "Failed to process payments" });
  } finally {
    connection.release();
  }
});

export default paymentPostRoute;
