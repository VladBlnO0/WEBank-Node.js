import React, { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom";
import styles from "../css/User.module.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Toast, ToastContainer } from 'react-bootstrap'

const API_BASE_URL = "http://localhost:4000";

export default function PaymentPage() {

    const [services, setServices] = useState([]);
    const [selected, setSelected] = useState([]);

    const [payments, setPayments] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [ToastMsg, setToastMsg] = useState({ heading: '', content: null });

    const [user, setUser] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/content/services`)
            .then((res) => res.json())
            .then((data) => setServices(data.servicesData));
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/user/paymentsGet`)
            .then((res) => res.json())
            .then((data) => setPayments(data.paymentsDueData));
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/user/balance?number=1`)
            .then((res) => res.json())
            .then((data) => setUser(data.userData));
    }, []);

    const userBalance = parseFloat(user[0]?.balance ?? 0);

    const toggleService = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id],
        );
    };

    const total = selected.reduce((sum, id) => {
        const item = services.find((s) => s.id === id);
        return item ? sum + parseFloat(item.tariff) : sum;
    }, 0);

    const newBalance = userBalance - parseFloat(total);

    const handleSubmit = () => {
        if (selected.length === 0) {
            setToastMsg({
                heading: "Помилка",
                content: "Виберіть хоча б одну послугу для оплати.",
            });
            setShowToast(true);
            return;
        }

        const userBalance = parseFloat(user[0]?.balance ?? 0);

        if (total > userBalance) {
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
        const selectedServices = services.filter(s => selected.includes(s.id));

        const payload = {
            senderAccountNumber: senderCard?.replace(/\D/g, ''),
            amount: parseFloat(total),
            services: selectedServices.map(service => ({
                service_id: service.id
            }))
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/user/paymentsPost`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            setShowModal(false);

            setToastMsg({
                heading: "Успіх",
                content: "Оплата послуг виконана успішно!",
            });

            setShowToast(true)

        } catch (error) {
            console.error("Transfer failed:", error.message);

            setToastMsg({
                heading: "Помилка",
                content: error.message || "Не вдалося оплатити послуги",
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
                            state={{ from: "/user-services" }}
                            className="btn btn-light text-start d-flex align-items-center"
                        >
                            <i className="bi bi-arrow-repeat me-2"></i> Перекази
                        </NavLink>
                        <NavLink
                            to="/services"
                            className="btn btn-light text-start d-flex align-items-center active"
                        >
                            <i className="bi bi-credit-card me-2"></i> Послуги
                        </NavLink>
                    </nav>
                </aside>

                <main className="flex-grow-1 p-4">

                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Підтвердження переказу</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                Ви впевнені, що хочете оплатити <strong>{selected.length}</strong> послуги
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

                    <div className="card mb-4 p-4">
                        <table className="table">
                            <thead>
                            <tr className="table-light">
                                <th></th>
                                <th>Послуга</th>
                                <th>Провідник</th>
                                <th>Сума</th>
                                <th>Оплатити до</th>
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {services.map((service) => {
                                const payment = payments.find((p) => p.service_id === service.id);

                                let status = "В очікуванні";
                                let badgeClass = "bg-secondary";

                                if (payment) {
                                    if (payment.status) {
                                        status = "Оплачено";
                                        badgeClass = "bg-success";

                                    } else {
                                        const due = new Date(payment.due_date);
                                        const today = new Date();
                                        if (due < today) {
                                            status = "Прострочено";
                                            badgeClass = "bg-danger";
                                        } else {
                                            status = "В очікуванні";
                                            badgeClass = "bg-warning";
                                        }
                                    }
                                }
                                return (
                                    <tr key={service.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(service.id)}
                                                onChange={() => toggleService(service.id)}
                                                disabled={payment && payment.status}
                                            />
                                        </td>
                                        <td>
                                            <i className={`${service.icon} me-2`}></i> {service.name}
                                        </td>
                                        <td>{service.provider}</td>
                                        <td>$
                                            {
                                                service ? service.tariff : "-"
                                            }
                                        </td>
                                        <td>
                                            {
                                                payment
                                                ? new Date(payment.due_date).toLocaleDateString()
                                                : "-"
                                            }
                                        </td>
                                        <td>
                                            <span className={`badge ${badgeClass}`}>{status}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    <div className="card p-4">
                        <h5 className="mb-3">Підсумок платежу</h5>
                        <div className="d-flex justify-content-between">
                            <span>Вибрані послуги:</span>
                            <span>{selected.length}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Загальна сума:</span>
                            <span>${total}</span>
                        </div>
                        <div className="border-top my-3"></div>

                        <button onClick={handleSubmit} className="btn btn-dark w-100">
                            Оплатити <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                    </div>
                </main>
            </div>

            <footer className={styles.footer}>
                © 2025 Bank. Всі права захищені.
            </footer>
        </div>
    );
}
