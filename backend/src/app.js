const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const transRoute = require(path.join(__dirname, 'api', 'finance', 'transactions'));
const senRoute = require(path.join(__dirname, 'api', 'finance', 'senders'));
const recRoute = require(path.join(__dirname, 'api', 'finance', 'receivers'));

const balanceRoute = require(path.join(__dirname, 'api', 'user', 'balance'));
const transactionsRoute = require(path.join(__dirname, 'api', 'user', 'transactions'));

const sendingRoute = require(path.join(__dirname, 'api', 'user', 'sending'));

const servicesRoute = require(path.join(__dirname, 'api', 'content', 'services'));

const paymentsGetRoute = require(path.join(__dirname, 'api', 'user', 'paymentsGet'));
const paymentsPostRoute = require(path.join(__dirname, 'api', 'user', 'paymentsPost'));

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/finance/transactions', transRoute);
app.use('/api/finance/transactions', senRoute);
app.use('/api/finance/transactions', recRoute);

app.use('/api/user/', balanceRoute);
app.use('/api/user/', transactionsRoute);
app.use('/api/user/', sendingRoute);
app.use('/api/content/', servicesRoute);

app.use('/api/user/', paymentsGetRoute);
app.use('/api/user/', paymentsPostRoute);


const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));