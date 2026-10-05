import { useEffect, useState } from "react";
import "./OrderList.css";

const API = import.meta.env?.VITE_API_URL || "http://localhost:3006/api";

const statusLabels = {
  pending: "New Order",
  preparing: "Preparing",
  ready: "Ready to Pick Up",
  completed: "Completed",
};

const nextStatuses = {
  pending: "preparing",
  preparing: "ready",
  ready: "completed",
};

export function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Sign in with a chef account to see kitchen orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API}/orders/kitchen`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || data.message || "Could not load kitchen orders.");
        setOrders(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(loadError.message || "Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  async function handleStatusAdvance(order) {
    const currentStatus = String(order.status).toLowerCase();
    const nextStatus = nextStatuses[currentStatus];
    if (!nextStatus) return;

    setUpdatingOrder(order.order_id);
    setError("");
    try {
      const response = await fetch(`${API}/orders/kitchen/${order.order_id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.message || "Could not update order status.");

      setOrders((currentOrders) => currentOrders.map((item) =>
        item.order_id === order.order_id ? { ...item, status: nextStatus } : item
      ));
      if (nextStatus === "completed") {
        setOrders((currentOrders) => currentOrders.filter((item) => item.order_id !== order.order_id));
      }
    } catch (updateError) {
      setError(updateError.message || "Could not update order status.");
    } finally {
      setUpdatingOrder(null);
    }
  }

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <h1 className="title">Active Kitchen Orders</h1>
        <p className="subtitle">Update order statuses to notify waiting customers</p>
      </div>

      {loading && <p>Loading kitchen orders...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No active orders right now.</p>}

      <div className="orders-grid">
        {orders.map((order) => {
          const status = String(order.status || "pending").toLowerCase();
          const label = statusLabels[status] || order.status;
          const pickupTime = order.pickup_time
            ? new Date(order.pickup_time).toLocaleString()
            : "To be confirmed";
          return (
            <div key={order.order_id} className="order-card">
              <div className="card-top">
                <span className="order-id">Order #{order.order_id}</span>
                <span className={`status-badge ${label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <span aria-hidden="true">●</span> {label}
                </span>
              </div>

              <div className="customer-info">
                <p className="customer-name">{order.customer_name}</p>
                <p className="pickup-time">Pickup: {pickupTime}</p>
              </div>

              <div className="items-summary">
                {order.items?.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="item-line">
                    <span>{item.quantity}×</span> {item.name}
                  </div>
                ))}
              </div>

              <div className="card-footer">
                <span className="order-total">€{Number(order.total_amount || 0).toFixed(2)}</span>
                {nextStatuses[status] && (
                  <button
                    className="advance-btn"
                    disabled={updatingOrder === order.order_id}
                    onClick={() => handleStatusAdvance(order)}
                  >
                    {updatingOrder === order.order_id ? "Saving..." :
                      status === "pending" ? "Start Preparing" :
                      status === "preparing" ? "Mark as Ready" : "Complete Order"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
