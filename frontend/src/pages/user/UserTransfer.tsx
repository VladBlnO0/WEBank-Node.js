import React, { useEffect } from 'react'
import { NavLink } from "react-router-dom";
import styles from "../css/User.module.css";
import { useState } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Toast, ToastContainer} from 'react-bootstrap';


const API_BASE_URL = "http://localhost:4000";

export default function UserTransfer() {

    const [card, setCard] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const [showCardTooltip, setShowCardTooltip] = useState(false);
    const [showAmountTooltip, setShowAmountTooltip] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [ToastMsg, setToastMsg] = useState({ heading: '', content: null });

    const [user, setUser] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/user/balance?number=1`)
            .then((res) => res.json())
            .then((data) => setUser(data.userData));
    }, []);

    const userBalance = parseFloat(user[0]?.balance ?? 0);
    const newBalance = userBalance - parseFloat(amount);

    const formatCard = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(.{4})/g, '$1 ')
            .trim();
    };
    const handleCardChange = (e) => {
        e.preventDefault();

        const rawValue = e.target.value;
        const formatted = formatCard(rawValue);
        setCard(formatted);
    };

    const handleAmountChange = (e) => {
        const raw = e.target.value;
        if (raw === "") {
            setAmount("");
            return;
        }

        const match = raw.match(/^\d*\.?\d{0,2}$/);
        if (match && raw <= 100001) {
            setAmount(raw);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const userBalance = parseFloat(user[0]?.balance ?? 0);
        const senderCard = user[0]?.number;

        const amountDB = parseFloat(amount);

        const cardNumberForDB = card.replace(/\s/g, '');
        const cardNumberDB = senderCard?.replace(/\D/g, '') ?? '';


        if (!cardNumberForDB || cardNumberForDB.length !== 16) {
            if (cardNumberForDB.length !== 16) {
                setShowCardTooltip(true);
                return;
            }
        }
        if (cardNumberDB === cardNumberForDB) {
            setToastMsg({
                heading: "Помилка",
                content: "Неможливо надіслати кошти на власну картку",
            });
            setShowToast(true);
            return;
        }
        if (isNaN(amountDB) || amountDB <= 0) {
            setShowAmountTooltip(true);
            return;
        }

        if (amountDB > userBalance) {
            setToastMsg({
                heading: "Помилка",
                content: "Недостатньо коштів на рахунку.",
            });
            setShowToast(true);
            return;
        }

        setShowModal(true);
    };

    const confirmTransfer = async () => {
        const senderCard = user[0]?.number;
        const payload = {
            card: card.replace(/\D/g, ''),
            senderAccountNumber: senderCard?.replace(/\D/g, ''),
            amount: parseFloat(amount),
            description,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/sending`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const result = await response.json();
            console.log("Confirmed transfer:", result.message);
            setShowModal(false);

            setToastMsg({
                heading: "Переказ підтверджено",
                content: "Кошти успішно надіслано!",
            });
            setShowToast(true)

        } catch (error) {
            console.error("Transfer failed:", error.message);

            setToastMsg({
                heading: "Помилка",
                content: error.message || "Не вдалося виконати транзакцію",
            });
            setShowToast(true);
        }
    };


    return (
        <div
            className="d-flex p-2 justify-content-between flex-column"
            style={{ minHeight: "100%" }}
        >
            <div className="p-2 d-flex rounded overflow-hidden shadow bg-white">
                <aside
                    className="bg-white border-end d-flex flex-column"
                    style={{ minHeight: "90vh", width: "250px" }}
                >
                    <div className="p-4 border-bottom d-flex align-items-center fw-semibold">
                        <i className="bi bi-bank2 me-2"></i> Bank
                    </div>
                    <nav className="d-flex flex-column p-2 gap-2">
                        <NavLink
                            to="/"
                            className="btn btn-light text-start d-flex align-items-center"
                        >
                            <i className="bi bi-wallet2 me-2"></i> Мій рахунок
                        </NavLink>
                        <NavLink
                            to="/transfer"
                            className="btn btn-light text-start d-flex align-items-center active"
                        >
                            <i className="bi bi-arrow-repeat me-2"></i> Перекази
                        </NavLink>
                        <NavLink
                            to="/services"
                            className="btn btn-light text-start d-flex align-items-center"
                        >
                            <i className="bi bi-credit-card me-2"></i> Послуги
                        </NavLink>
                    </nav>
                </aside>

                <main className="flex-grow-1 p-4 d-flex justify-content-center align-items-center">
                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Підтвердження переказу</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                Ви впевнені, що хочете надіслати <strong>${amount}</strong>
                            </p>
                            <p>
                                На картку {card}?
                            </p>
                            <p>
                                Баланс після переказу: ${newBalance.toFixed(2)}
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Скасувати
                            </Button>
                            <Button variant="primary" onClick={confirmTransfer}>
                                Підтвердити
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <ToastContainer
                        className="p-3"
                        position={'middle-center'}
                        style={{ zIndex: 1 }}
                    >
                        <Toast onClose={() => setShowToast(false)}
                               show={showToast}
                               delay={3000}
                               autohide
                               style={{ backgroundColor: '#fff' }}>
                            <Toast.Header>
                                <strong className="me-auto">{ToastMsg.heading}</strong>
                            </Toast.Header>
                            <Toast.Body>
                                {ToastMsg.content}
                            </Toast.Body>
                        </Toast>
                    </ToastContainer>
                    <form
                        className="card p-4 shadow w-100"
                        style={{ maxWidth: 700 }}
                        onSubmit={handleSubmit}
                    >
                        <h4 className="mb-4">Переказ коштів</h4>

                        <div className="mb-3">
                            <label className="form-label">Номер картки</label>
                            <div className="input-group">
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    maxLength="19"
                                    required

                                    value={card}
                                    onChange={handleCardChange}
                                    onMouseEnter={() => setShowCardTooltip(true)}
                                    onMouseLeave={() => setShowCardTooltip(false)}
                                    onFocus={() => setShowCardTooltip(true)}
                                    onBlur={() => setShowCardTooltip(false)}
                                />
                                {showCardTooltip && (
                                    <div className="position-absolute top-100 mt-1 bg-light border p-2 rounded shadow-sm small">
                                        Будь ласка, введіть номер вашої картки (16 цифр)
                                    </div>
                                )}
                                <span className="input-group-text">
                  <i className="bi bi-credit-card"></i>
                </span>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Сума</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="0.00"
                                    step="1"
                                    required
                                    value={amount}
                                    onChange={handleAmountChange}
                                    onBlur={() => {
                                        if (amount !== "") {
                                            setAmount(Number(amount).toFixed(2));
                                        }
                                        setShowAmountTooltip(false)
                                    }}

                                    onMouseEnter={() => setShowAmountTooltip(true)}
                                    onMouseLeave={() => setShowAmountTooltip(false)}
                                    onFocus={() => setShowAmountTooltip(true)}
                                />
                                {showAmountTooltip && (
                                    <div className="position-absolute top-100 mt-1 bg-light border p-2 rounded shadow-sm small">
                                        Будь ласка, введіть суму, яку ви хочете надіслати
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Опис</label>
                            <textarea
                                className={styles.transfer_form}
                                placeholder="Для чого цей переказ?"
                                rows="3"
                                maxLength="40"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-dark w-100">
                            <i className="bi bi-send me-2"></i> Надіслати
                        </button>
                    </form>
                </main>
            </div>

            <footer className={styles.footer}>
                © 2025 Bank. Всі права захищені.
            </footer>
        </div>
    );
}
