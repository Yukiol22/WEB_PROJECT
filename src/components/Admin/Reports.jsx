import { useState } from "react";
import "./Reports.css";

export default function Reports() {
  const [timeframe, setTimeframe] = useState("This Month");

  const reportSummary = {
    totalRevenue: "$14,280.00",
    totalOrders: 428,
    averageOrderValue: "$33.36",
    topCategory: "Mains (54%)",
  };

  const paymentBreakdown = [
    {
      method: "Credit Card",
      amount: "$8,560.00",
      percentage: 60,
      color: "#3b82f6",
    },
    {
      method: "Online Payment",
      amount: "$3,420.00",
      percentage: 24,
      color: "#8b5cf6",
    },
    { method: "Cash", amount: "$2,300.00", percentage: 16, color: "#10b981" },
  ];

  const handleExport = () => {
    alert(`Exporting sales report for: ${timeframe}`);
  };

  return (
    <div className="reports-container">
      {/* Top Bar */}
      <div className="reports-header">
        <div>
          <h1 className="reports-title">Sales & Financial Reports</h1>
          <p className="reports-subtitle">
            Track revenue performance and payment statistics
          </p>
        </div>

        <div className="header-actions">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="timeframe-select"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>

          <button className="export-btn" onClick={handleExport}>
            <span className="btn-icon">📥</span> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="reports-grid">
        <div className="report-card">
          <span className="card-label">Total Revenue</span>
          <span className="card-value highlight">
            {reportSummary.totalRevenue}
          </span>
        </div>
        <div className="report-card">
          <span className="card-label">Total Orders Completed</span>
          <span className="card-value">{reportSummary.totalOrders}</span>
        </div>
        <div className="report-card">
          <span className="card-label">Avg. Order Value</span>
          <span className="card-value">{reportSummary.averageOrderValue}</span>
        </div>
        <div className="report-card">
          <span className="card-label">Top Selling Category</span>
          <span className="card-value">{reportSummary.topCategory}</span>
        </div>
      </div>

      {/* Payment Method Breakdown Card */}
      <div className="table-card">
        <div className="table-card-header">
          <h3 className="section-title">Payment Method Breakdown</h3>
        </div>
        <table className="reports-table">
          <thead>
            <tr>
              <th style={{ width: "35%" }}>Payment Method</th>
              <th style={{ width: "30%" }}>Total Processed</th>
              <th style={{ width: "35%" }}>Share of Revenue</th>
            </tr>
          </thead>
          <tbody>
            {paymentBreakdown.map((item, idx) => (
              <tr key={idx}>
                <td className="method-name">{item.method}</td>
                <td className="amount-cell">{item.amount}</td>
                <td>
                  <div className="share-cell">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="share-badge" style={{ color: item.color }}>
                      {item.percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
