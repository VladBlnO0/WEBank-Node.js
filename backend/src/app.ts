import express from "express";
import cors from "cors";

const pool = require("./db");
const app = express();
const port = 3000;
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const transRoute = require(join(__dirname, "api", "finance", "transactions"));
// const senRoute = require(join(__dirname, "api", "finance", "senders"));
// const recRoute = require(join(__dirname, "api", "finance", "receivers"));

import balanceRoute from "./api/user/balance";
import transactionsRoute from "./api/finance/transactions";

import userTransactionsRoute from "./api/user/transactions";

// const sendingRoute = require(join(__dirname, "api", "user", "sending"));

import servicesRoute from "./api/content/services";
import paymentGetRoute from "./api/user/paymentGet";
import paymentPostRoute from "./api/user/paymentPost";
import sendingPostRoute from "./api/user/sending";
// const paymentsGetRoute = require(join(__dirname, "api", "user", "paymentsGet"));
// const paymentsPostRoute = require(
//   join(__dirname, "api", "user", "paymentsPost"),
// );

app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

// router.get("/balance", async (req: any, res: any) => {
//   const [rows] = await pool.query("SELECT * FROM db.accounts");
//   res.json(rows);
// });

app.use("/balance", balanceRoute);
app.use("/user", userTransactionsRoute);

app.use("/payments", paymentGetRoute);
app.use("/payments", paymentPostRoute);

app.use("/sending", sendingPostRoute);

// app.use("/api/finance/transactions", transRoute);
// app.use("/api/finance/transactions", senRoute);
// app.use("/api/finance/transactions", recRoute);

app.use("/services", servicesRoute);

app.use(router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
