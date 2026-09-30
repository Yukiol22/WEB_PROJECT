import { useEffect, useState } from "react";
import "./OrderList.css";

const API_URL = "http://localhost:3006/api/admin/orders";

function getToken() {

  return localStorage.getItem("adminToken") || localStorage.getItem("token");
}

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

function getNextStatus(status) {
  const next = {
    pending: "preparing",
    preparing: "ready",
    ready: "completed",
  };
  return next[String(status || "").toLowerCase()];
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Today");
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      const token = getToken();
      if (!token) {
        if (isMounted) {
          setError("Please sign in with an admin account to view orders.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || result.error || "Could not load orders from the server.");
        }
        if (isMounted) {
          setOrders(Array.isArray(result) ? result : result.data || []);
          setError("");
        }
      } catch (requestError) {
        if (isMounted) setError(requestError.message || "Could not connect to the server.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOrders();
    const refreshTimer = setInterval(loadOrders, 30000);
    return () => {
      isMounted = false;
      clearInterval(refreshTimer);
    };
  }, []);

  async function advanceOrder(order) {
    const id = order.order_id ?? order.id;
    const nextStatus = getNextStatus(order.status);
    const token = getToken();
    if (!nextStatus || !token) return;

    setUpdatingOrder(id);
    setError("");
    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || result.error || "Could not update this order.");
      }
      setOrders((currentOrders) => currentOrders.map((current) =>
        (current.order_id ?? current.id) === id ? { ...current, status: nextStatus } : current,
      ));
    } catch (requestError) {
      setError(requestError.message || "Could not update this order.");
    } finally {
      setUpdatingOrder(null);
    }
  }

  const filteredOrders = orders.filter((order) => {
    const statusMatches = selectedStatus === "All Status"
      || String(order.status || "").toLowerCase() === selectedStatus;
    if (!statusMatches) return false;

    if (selectedTimeframe === "All Time") return true;
    const createdAt = order.created_at || order.pickup_time;
    if (!createdAt) return selectedTimeframe === "Today";
    const date = new Date(createdAt);
    const now = new Date();
    if (selectedTimeframe === "Today") return date.toDateString() === now.toDateString();
    if (selectedTimeframe === "This Week") {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      return date >= weekStart;
    }
    if (selectedTimeframe === "This Month") {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    return true;
  });

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <h2 className="title">Orders</h2>

        <div className="filter-controls">
          <div className="select-wrapper">
            <span className="icon">Status</span>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="filter-select">
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
            <select value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)} className="filter-select">
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
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Time</th>
              <th>Customer</th>
              <th>Location</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredOrders.map((order) => {
              const id = order.order_id ?? order.id;
              const nextStatus = getNextStatus(order.status);
              return (
                <tr key={id}>
                  <td className="order-id">#{id}</td>
                  <td className="order-date">{formatDate(order.created_at || order.pickup_time)}</td>
                  <td className="customer-name">{order.customer_name || "Customer"}</td>
                  <td className="location">{order.location || order.order_type || "—"}</td>
                  <td className="amount">${Number(order.total_amount || 0).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      <span className="dot">•</span> {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="actions">
                    {nextStatus ? <button
                      type="button"
                      className="order-status-button"
                      disabled={updatingOrder === id}
                      onClick={() => advanceOrder(order)}
                    >
                      {updatingOrder === id ? "Saving…" : `Mark ${getStatusLabel(nextStatus)}`}
                    </button> : "—"}
                  </td>
                </tr>
              );
            })}
            {!loading && filteredOrders.length === 0 && !error && (
              <tr><td colSpan="7" className="orders-empty">No orders found for this filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
