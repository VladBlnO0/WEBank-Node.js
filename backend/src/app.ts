import express from "express";
import cors from "cors";

import { initDB } from "./db";

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import balanceRoute from "./api/user/balance";
import userTransactionsRoute from "./api/user/transactions";
import servicesRoute from "./api/content/services";
import paymentGetRoute from "./api/user/paymentGet";
import paymentPostRoute from "./api/user/paymentPost";
import sendingPostRoute from "./api/user/sending";

app.use("/balance", balanceRoute);
app.use("/user", userTransactionsRoute);
app.use("/payments", paymentGetRoute);
app.use("/payments", paymentPostRoute);
app.use("/sending", sendingPostRoute);
app.use("/services", servicesRoute);

app.use(router);

async function startServer() {
  try {
    await initDB();
    console.log("Database connected successfully.");
    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
