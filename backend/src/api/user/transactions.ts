import express from "express";

const pool = require("../../db");
const usersTransactionsRoute = express.Router();

interface Transaction {
  id: number;
  sender_id: number;
  receiver_id: number;
  sender_number: string;
  receiver_number: string;
  amount: number;
  date: string;
  description: string;
  type: "Надіслано" | "Отримано" | "Оплата";
  status: string;
  label: string;
}

interface Payment {
  id: number;
  amount_due: number;
  payment_date: string;
  service_name: string;
  status: string;
  type: "Оплата";
}

usersTransactionsRoute.get("/:number/transactions", async (req, res) => {
  const accountNumber = req.params.number;

  if (!accountNumber) {
    return res.status(400).json({ message: "Missing account" });
  }

  const sqlSend = `
        SELECT 
            a.number,
            t.id,
               t.sender_id,
               t.receiver_id,
               t.amount,
               t.date,
               t.description,
               r.number AS receiver_number,
               'Надіслано' AS type
        FROM db.transactions t
                 JOIN db.accounts a ON t.sender_id = a.id
                 JOIN db.accounts r ON t.receiver_id = r.id
        WHERE a.id = ?
        ORDER BY t.date DESC
    `;

  const sqlReceive = `
        SELECT t.id, 
               t.sender_id, 
               t.receiver_id, 
               t.amount, 
               t.date,
               t.description,
               'Отримано' AS type,
               s.number AS sender_number
        FROM db.transactions t
                 JOIN db.accounts a ON t.receiver_id = a.id
                 JOIN db.accounts s ON t.sender_id = s.id
        WHERE a.id = ?
        ORDER BY t.date DESC
    `;

  const sqlPayment = `
        SELECT p.id, 
               p.amount_due, 
               p.payment_date, 
               p.service_id,
               p.status,
               'Оплата' AS type,
               s.name AS service_name
        FROM db.payments p
                 JOIN db.accounts a ON p.account_id = a.id
                 JOIN db.services s ON p.service_id = s.id
        WHERE a.id = ? AND p.status = 1
        ORDER BY p.payment_date DESC
    `;

  try {
    const [sendResults]: any = await pool.query(sqlSend, [accountNumber]);
    const [receiveResults]: any = await pool.query(sqlReceive, [accountNumber]);
    const [paymentResults]: any = await pool.query(sqlPayment, [accountNumber]);

    const send = sendResults.map((tx: Transaction) => ({
      id: tx.id,
      date: tx.date,
      amount: -tx.amount,
      description: tx.description || "",
      status: `On card ****${tx.receiver_number?.slice(-4)}`,
      label: "On card",
      type: "Sent",
    }));

    const received = receiveResults.map((tx: Transaction) => ({
      id: tx.id,
      date: tx.date,
      amount: tx.amount,
      description: tx.description || "",
      status: `From card ****${tx.sender_number?.slice(-4)}`,
      label: "Received from card",
      type: "Received",
    }));

    const payment = paymentResults.map((p: Payment) => ({
      id: p.id,
      date: p.payment_date,
      amount: -p.amount_due,
      description: `Service #${p.service_name}`,
      label: "Payment for service",
      type: "Payment",
    }));

    const combined = [...send, ...received, ...payment]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 500);

    res.json({ transactions: combined });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default usersTransactionsRoute;
