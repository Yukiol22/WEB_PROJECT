import { useEffect, useState } from "react";
import "./OrderList.css";

const API_URL = "http://localhost:3006/api/admin/orders";

function getStatusLabel(status) {
  const labels = {
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready for Pick-Up",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[String(status || "").toLowerCase()] || status || "Unknown";
}

function getStatusClass(status) {
  switch (String(status || "").toLowerCase()) {
    case "pending": return "status-new";
    case "preparing": return "status-delivery";
    case "ready": return "status-ready";
    case "completed": return "status-completed";
    case "cancelled": return "status-cancelled";
    default: return "status-default";
  }
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedTimeframe, setSelectedTimeframe] = useState("All Time");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) {
          setError("Please sign in with an admin account to view orders.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || "Could not load orders.");
        if (isMounted) {
          const rows = Array.isArray(result) ? result : result.data || [];
          setOrders(rows.filter((order) => order && (order.order_id ?? order.id) != null));
          setError("");
        }
      } catch (requestError) {
        if (isMounted) setError(requestError.message || "Could not connect to the server.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOrders();
    const timer = setInterval(loadOrders, 30000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus !== "All Status" && String(order.status || "").toLowerCase() !== selectedStatus) return false;
    if (selectedTimeframe === "All Time") return true;

    const value = order.created_at || order.pickup_time;
    if (!value) return false;
    const date = new Date(value);
    const now = new Date();
    if (selectedTimeframe === "Today") return date.toDateString() === now.toDateString();
    if (selectedTimeframe === "This Week") {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      return date >= start;
    }
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <h2 className="title">Orders</h2>
        <div className="filter-controls">
          <div className="select-wrapper">
            <span className="icon">Status</span>
            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="filter-select">
              <option value="All Status">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready for Pick-Up</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="select-wrapper">
            <span className="icon">Date</span>
            <select value={selectedTimeframe} onChange={(event) => setSelectedTimeframe(event.target.value)} className="filter-select">
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="All Time">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {error && <p className="order-message" role="alert">{error}</p>}
      {loading && <p className="order-message">Loading orders…</p>}

      <div className="table-card">
        <table className="orders-table">
          <thead><tr><th>Order ID</th><th>Order Time</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {!loading && filteredOrders.map((order) => (
              <tr key={order.order_id ?? order.id}>
                <td className="order-id">#{order.order_id ?? order.id}</td>
                <td className="order-date">{formatDate(order.created_at)}</td>
                <td className="customer-name">{order.customer_name || "Customer"}</td>
                <td className="location">{order.items?.length
                  ? order.items.map((item) => `Item #${item.item_id} (${item.name}) × ${item.quantity}`).join(", ")
                  : "No item details"}</td>
                <td className="amount">€{Number(order.total_amount || 0).toFixed(2)}</td>
                <td><span className={`status-badge ${getStatusClass(order.status)}`}>
                  <span className="dot">•</span> {getStatusLabel(order.status)}
                </span></td>
              </tr>
            ))}
            {!loading && filteredOrders.length === 0 && !error && (
              <tr><td colSpan="6" className="orders-empty">{orders.length === 0 ? "No orders yet." : "No orders found for this filter."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
