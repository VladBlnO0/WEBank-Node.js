create table db.transactions
(
    id          int                null,
    sender_id   int                null,
    receiver_id int                null,
    amount      decimal(20, 2)     null,
    date        timestamp          null,
    status      enum ('ok', 'bad') null,
    description text               null
);

