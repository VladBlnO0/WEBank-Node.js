import express from "express";
import cors from "cors";

const pool = require("./db");
const app = express();
const port = 3000;
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
