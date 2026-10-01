import { useState, useEffect } from "react";
import "./OrderList.css";

const API = import.meta.env?.VITE_API_URL || "http://localhost:3000/api";


const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const NEXT = {
  "New Order": "Preparing",
  Preparing: "Ready to Pick Up",
  "Ready to Pick Up": "Completed",
};

export function OrderList() {
  const [orders, setOrders] = useState([]);


  const loadOrders = async () => {
    const res = await fetch(`${API}/admin/orders`, { headers: authHeaders() });
    if (!res.ok) return; 
    const all = await res.json();
    setOrders(all.filter((o) => o.status !== "Completed")); 
  };


  useEffect(() => {
    loadOrders();
    const timer = setInterval(loadOrders, 10000);
    return () => clearInterval(timer);
  }, []);

  const advance = async (order) => {
    await fetch(`${API}/admin/orders/${order.order_id}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status: NEXT[order.status] }),
    });
    loadOrders();
  };

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <h1 className="title">Active Kitchen Orders</h1>
        <p className="subtitle">
          Update order statuses to notify waiting customers
        </p>
      </div>

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.order_id} className="order-card">
            <div className="card-top">
              <span className="order-id">#{order.order_id}</span>
              <span
                className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, "-")}`}
              >
                ● {order.status}
              </span>
            </div>

            <div className="customer-info">
              <p className="customer-name">{order.customer_name}</p>
              <p className="pickup-time">Est. Pickup: {order.pickup_time}</p>
            </div>

            <div className="items-summary">
              {order.items.map((it, idx) => (
                <div key={idx} className="item-line">
                  <span>{it.quantity}x</span> {it.name}
                </div>
              ))}
            </div>

            <div className="card-footer">
              <span className="order-total">
                ${Number(order.total_amount).toFixed(2)}
              </span>
              <button className="advance-btn" onClick={() => advance(order)}>
                Next Step
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
