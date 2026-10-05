import { useEffect, useState } from "react";
import "./DashBoard.css";

const ORDERS_URL = "http://localhost:3006/api/admin/orders";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) {
          setError("Please sign in with an admin account to view dashboard data.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(ORDERS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || result.error || "Could not load dashboard data.");
        }
        if (isMounted) setOrders(Array.isArray(result) ? result : result.data || []);
      } catch (requestError) {
        if (isMounted) setError(requestError.message || "Could not connect to the server.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOrders();
    return () => { isMounted = false; };
  }, []);

  const activeOrders = orders.filter((order) =>
    !["completed", "cancelled"].includes(String(order.status || "").toLowerCase()),
  );
  const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  const stats = [
    {
      title: "Total Sales",
      value: `€${totalSales.toFixed(2)}`,
      change: "Across all orders",
      emoji: "💰",
    },
    {
      title: "Active Orders",
      value: loading ? "…" : String(activeOrders.length),
      change: "Not completed",
      emoji: "🧾",
    },
    {
      title: "Total Orders",
      value: loading ? "…" : String(orders.length),
      change: "Across all statuses",
      emoji: "📦",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-eyebrow">OVERVIEW</p>
          <h1 className="dashboard-title">Good day, Admin</h1>
          <p className="dashboard-subtitle">Here’s what’s happening at your restaurant.</p>
        </div>
        <div className="dashboard-date">
          {new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date())}
        </div>
      </div>
      {error && <p className="dashboard-error" role="alert">{error}</p>}

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              <span className="stat-icon">{stat.emoji}</span>
            </div>
            <div className="stat-body">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-change neutral">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
