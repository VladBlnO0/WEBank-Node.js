create table db.transactions
(
    id          int auto_increment
        primary key,
    sender_id   int                       null,
    receiver_id int                       null,
    amount      decimal(20, 2)            null,
    date        timestamp default (now()) null,
    status      text                      null,
    description text                      null,
    type        enum ('Sent', 'Received') null
);

