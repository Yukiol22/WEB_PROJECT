
import "./DashBoard.css";

export default function Dashboard() {
  const stats = [
    {
      title: "Today's Sales",
      value: "$1,240.50",
      change: "+12.5%",
      isPositive: true,
      emoji: "💰",
    },
    {
      title: "Active Orders",
      value: "14",
      change: "4 pending",
      isPositive: true,
      emoji: "🛎️",
    },
    {
      title: "Total Orders",
      value: "86",
      change: "+8%",
      isPositive: true,
      emoji: "📦",
    },
    {
      title: "Staff on Shift",
      value: "6",
      change: "2 on break",
      isPositive: false,
      emoji: "👥",
    },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Overview</h1>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              <span className="stat-icon">{stat.emoji}</span>
            </div>
            <div className="stat-body">
              <span className="stat-value">{stat.value}</span>
              <span
                className={`stat-change ${stat.isPositive ? "positive" : "neutral"}`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
