import { useEffect, useState } from "react";
import "./MyOrders.css";

const API = import.meta.env?.VITE_API_URL || "http://localhost:3006/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Sign in to see your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || data.message || "Could not load your orders.");
        setOrders(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(loadError.message || "Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <section className="my-orders">
      <div className="my-orders-heading">
        <div>
          <p className="my-orders-eyebrow">YOUR ACCOUNT</p>
          <h1>My Orders</h1>
          <p>Check your order status and pickup details.</p>
        </div>
      </div>

      {loading && <p>Loading your orders...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>You have not placed any orders yet.</p>}

      <div className="my-orders-list">
        {orders.map((order) => {
          const id = order.orderId ?? order.order_id;
          const status = order.status || "pending";
          const amount = Number(order.totalAmount ?? order.total_amount ?? 0);
          const pickupTime = order.pickupTime ?? order.pickup_time;
          return (
            <article className="my-order-card" key={id}>
              <div className="my-order-top">
                <span className="my-order-number">Order #{id}</span>
                <span className={`my-order-status ${String(status).toLowerCase()}`}>
                  <span aria-hidden="true">&#9679;</span> {status}
                </span>
              </div>
              {order.items?.length > 0 && (
                <div className="my-order-items" aria-label="Items in this order">
                  {order.items.map((item) => (
                    <p key={item.itemId}>
                      {item.quantity} × {item.name}
                    </p>
                  ))}
                </div>
              )}
              <div className="my-order-bottom">
                <span>Pickup <strong>{pickupTime ? new Date(pickupTime).toLocaleString() : "To be confirmed"}</strong></span>
                <strong className="my-order-total">€{amount.toFixed(2)}</strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
