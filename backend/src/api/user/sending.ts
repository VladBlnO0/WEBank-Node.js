import express from "express";

import { getDB } from "../../db";

const sendingPostRoute = express.Router();

sendingPostRoute.post("/post", async (req, res) => {
  const { card, amount, description, senderAccountNumber } = req.body;

  if (!card || !amount || !senderAccountNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const db = getDB();

  try {
    await db.run("BEGIN TRANSACTION");

    const [receiverResults]: any = await db.all(
      "SELECT id FROM accounts WHERE number = ?",
      [card],
    );
    if (receiverResults.length === 0) {
      await db.run("ROLLBACK");
      return res.status(404).json({ message: "Receiver account not found" });
    }
    const receiverId = receiverResults[0].id;

    const [senderResults]: any = await db.all(
      "SELECT id FROM accounts WHERE number = ?",
      [senderAccountNumber],
    );
    if (senderResults.length === 0) {
      await db.run("ROLLBACK");
      return res.status(404).json({ message: "Sender account not found" });
    }
    const senderId = senderResults[0].id;

    await db.run(
      `INSERT INTO transactions (sender_id, receiver_id, amount, status, description, type) VALUES (?, ?, ?, ?, ?, ?)`,
      [senderId, receiverId, amount, "ok", description, "Sent"],
    );

    await db.run("UPDATE accounts SET balance = balance - ? WHERE id = ?", [
      amount,
      senderId,
    ]);

    await db.run("UPDATE accounts SET balance = balance + ? WHERE id = ?", [
      amount,
      receiverId,
    ]);

    await db.run("COMMIT");
    res.json({ message: "Transaction successful" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default sendingPostRoute;
