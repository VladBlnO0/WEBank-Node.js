import express from "express";

const pool = require("../../db");
const sendingPostRoute = express.Router();

sendingPostRoute.post("/post", async (req, res) => {
  const { card, amount, description, senderAccountNumber } = req.body;

  if (!card || !amount || !senderAccountNumber) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [receiverResults]: any = await connection.query(
      "SELECT id FROM db.accounts WHERE number = ?",
      [card],
    );
    if (receiverResults.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Receiver account not found" });
    }
    const receiverId = receiverResults[0].id;

    const [senderResults]: any = await connection.query(
      "SELECT id FROM db.accounts WHERE number = ?",
      [senderAccountNumber],
    );
    if (senderResults.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Sender account not found" });
    }
    const senderId = senderResults[0].id;

    await connection.query(
      `INSERT INTO db.transactions (sender_id, receiver_id, amount, status, description, type) VALUES (?, ?, ?, ?, ?, ?)`,
      [senderId, receiverId, amount, "ok", description, "Sent"],
    );

    await connection.query(
      "UPDATE db.accounts SET balance = balance - ? WHERE id = ?",
      [amount, senderId],
    );

    await connection.query(
      "UPDATE db.accounts SET balance = balance + ? WHERE id = ?",
      [amount, receiverId],
    );

    await connection.commit();
    res.json({ message: "Transaction successful" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default sendingPostRoute;
