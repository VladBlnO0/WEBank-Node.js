create table db.payments
(
    id           int            null,
    account_id   int            null,
    service_id   int            null,
    due_date     date           null,
    amount_due   decimal(10, 2) null,
    status       tinyint        null,
    payment_date timestamp      null
);

