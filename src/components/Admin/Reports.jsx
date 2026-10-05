import { useEffect, useState } from "react";
import "./Reports.css";

const REPORTS_URL = "http://localhost:3006/api/admin/reports";

export default function Reports() {
  const [timeframe, setTimeframe] = useState("all");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadReport() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Sign in with an admin account to view reports.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${REPORTS_URL}?timeframe=${timeframe}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || data.message || "Could not load report.");
        if (isMounted) setReport(data);
      } catch (requestError) {
        if (isMounted) setError(requestError.message || "Could not connect to the server.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadReport();
    return () => { isMounted = false; };
  }, [timeframe]);

  function exportReport() {
    if (!report) return;
    const rows = [
      ["Report timeframe", report.timeframe],
      ["Completed order revenue", Number(report.totalRevenue || 0).toFixed(2)],
      ["Completed orders", report.completedOrders],
      ["Average order value", Number(report.averageOrderValue || 0).toFixed(2)],
      [],
      ["Popular item", "Category", "Quantity sold"],
      ...(report.popularItems || []).map((item) => [item.name, item.category, item.quantitySold]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `restaurant-report-${timeframe}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const topItem = report?.topItem;
  const timeframeLabel = { all: "All Time", today: "Today", week: "This Week", month: "This Month", year: "This Year" }[timeframe];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div>
          <h1 className="reports-title">Restaurant Reports</h1>
          <p className="reports-subtitle">Revenue and menu performance from saved orders</p>
        </div>
        <div className="header-actions">
          <select value={timeframe} onChange={(event) => setTimeframe(event.target.value)} className="timeframe-select">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="export-btn" onClick={exportReport} disabled={!report || loading}>Export CSV</button>
        </div>
      </div>

      {error && <p className="reports-subtitle" role="alert">{error}</p>}

      <div className="reports-grid">
        <div className="report-card"><span className="card-label">Completed Order Revenue</span><span className="card-value highlight">€{Number(report?.totalRevenue || 0).toFixed(2)}</span></div>
        <div className="report-card"><span className="card-label">Completed Orders</span><span className="card-value">{loading ? "…" : report?.completedOrders || 0}</span></div>
        <div className="report-card"><span className="card-label">Average Completed Order</span><span className="card-value">€{Number(report?.averageOrderValue || 0).toFixed(2)}</span></div>
        <div className="report-card"><span className="card-label">Best Selling Item</span><span className="card-value">{topItem ? `${topItem.name} (${topItem.quantitySold})` : "—"}</span></div>
      </div>

      <div className="reports-grid">
        <section className="table-card">
          <div className="table-card-header"><h2 className="section-title">Order Statuses · {timeframeLabel}</h2></div>
          <table className="reports-table">
            <thead><tr><th>Status</th><th>Orders</th></tr></thead>
            <tbody>
              {(report?.statuses || []).map((item) => <tr key={item.status}><td className="method-name">{item.status}</td><td>{item.count}</td></tr>)}
              {!loading && !report?.statuses?.length && <tr><td colSpan="2">No orders in this timeframe.</td></tr>}
            </tbody>
          </table>
        </section>

        <section className="table-card">
          <div className="table-card-header"><h2 className="section-title">Top Menu Items · {timeframeLabel}</h2></div>
          <table className="reports-table">
            <thead><tr><th>Item</th><th>Category</th><th>Qty Sold</th></tr></thead>
            <tbody>
              {(report?.popularItems || []).map((item) => <tr key={`${item.name}-${item.category}`}><td className="method-name">{item.name}</td><td>{item.category}</td><td>{item.quantitySold}</td></tr>)}
              {!loading && !report?.popularItems?.length && <tr><td colSpan="3">No completed order items in this timeframe.</td></tr>}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
