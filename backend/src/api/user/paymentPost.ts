import express from "express";

import { getDB } from "../../db";

const paymentPostRoute = express.Router();

paymentPostRoute.post("/post", async (req, res) => {
  // const { senderAccountNumber, amount, services } = req.body;
  const senderAccountNumber = "1234123412345234";
  const amount = 5;
  const services = [{ service_id: 1 }];

  if (
    !senderAccountNumber ||
    !amount ||
    !services ||
    !Array.isArray(services) ||
    services.length === 0
  ) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const db = getDB();

  try {
    await db.run("BEGIN TRANSACTION");

    const sender: [{ id: number; balance: string }] = await db.all(
      "SELECT id, balance FROM accounts WHERE number = ?",
      [senderAccountNumber],
    );

    if (!sender) {
      await db.run("ROLLBACK");
      return res.status(404).json({ message: "Sender account not found" });
    }

    const senderId = sender[0].id;
    const senderBalance = parseFloat(sender[0].balance);

    if (senderBalance < amount) {
      await db.run("ROLLBACK");
      return res.status(400).json({ message: "Insufficient funds" });
    }

    for (const service of services) {
      const { service_id } = service;

      await db.run(
        `
        UPDATE payments p
        JOIN accounts a ON p.account_id = a.id
        SET p.status       = 1,
            p.payment_date = NOW()
        WHERE a.number = ?
        AND p.service_id = ?
        AND p.status = 0
        `,
        [senderAccountNumber, service_id],
      );
    }

    await db.run("UPDATE accounts SET balance = balance - ? WHERE id = ?", [
      amount,
      senderId,
    ]);

    await db.run("COMMIT");
    res.json({ message: "Payments successful" });
  } catch (err) {
    await db.run("ROLLBACK");
    console.error("Payment transaction error:", err);
    res.status(500).json({ message: "Failed to process payments" });
  }
});

export default paymentPostRoute;
