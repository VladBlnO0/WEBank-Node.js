create table db.accounts
(
    id         int                      null,
    number     varchar(255)             null,
    balance    decimal(10, 2)           null,
    type       enum ('debit', 'credit') null,
    currency   char(3)                  null,
    created_at timestamp                null
);

