import { useState, useEffect } from "react";
import "./CustomerStatus.css";

const API = import.meta.env?.VITE_API_URL || "http://localhost:3000/api";
const REFRESH_MS = 5000; 

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const steps = ["New Order", "Preparing", "Ready to Pick Up", "Completed"];

export function CustomerStatus({ orderId }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let timer;

    const load = async () => {
      try {
        const res = await fetch(`${API}/orders/${orderId}`, {
          headers: authHeaders(),
        });
        if (res.status === 401) throw new Error("Please log in to see your order.");
        if (res.status === 404) throw new Error("We couldn't find that order.");
        if (!res.ok) throw new Error("Failed to load your order");
        const data = await res.json();
        if (cancelled) return;

        setOrder(data);
        setError("");

        if (data.status === "Completed") clearInterval(timer);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not connect to the server");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    timer = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="customer-container">
        <div className="status-card">No order selected.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="customer-container">
        <div className="status-card">Loading your order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="customer-container">
        <div className="status-card">{error || "Order not found."}</div>
      </div>
    );
  }

  const currentStepIndex = steps.indexOf(order.status);
  const isReady = order.status === "Ready to Pick Up";

  return (
    <div className="customer-container">
      <div className="status-card">
        <div className="header">
          <span className="order-id">Order #{order.order_id}</span>
          <h1 className="title">Track Your Order</h1>
        </div>


        {error && (
          <p className="banner-desc">Connection problem, retrying...</p>
        )}

        <div className={`status-banner ${isReady ? "is-ready" : ""}`}>
          <span className="banner-icon">
            {order.status === "Completed" ? "✅" : isReady ? "🎉" : "👨‍🍳"}
          </span>
          <div>
            <h3 className="banner-title">
              {isReady
                ? "Your Order is Ready for Pickup!"
                : order.status === "Completed"
                  ? "Order Completed. Enjoy your meal!"
                  : `Status: ${order.status}`}
            </h3>
            <p className="banner-desc">
              {isReady
                ? "Please head to the counter to collect your meal."
                : order.status === "Completed"
                  ? "Thank you for ordering with us."
                  : "Our kitchen is working on your order."}
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="progress-tracker">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step}
                className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
              >
                <div className="node">{isCompleted ? "✓" : idx + 1}</div>
                <span className="label">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Order Details */}
        <div className="items-box">
          <h3>Order Details</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="item-row">
              <span>
                {item.quantity}x {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
