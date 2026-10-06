import { useEffect, useState } from "react";
import "./Admin.css";
import Dashboard from "../components/Admin/Dashboard";
import Staffs from "../components/Admin/Staffs";
import Reports from "../components/Admin/Reports";
import Menu_Edit from "../components/Admin/Menu_Edit";
import OrderList from "../components/Admin/OrderList";
import Feedback from "../components/Admin/Feedback";

const navItems = [
  { name: "Feedback", icon: "★", component: Feedback },
  { name: "Dashboard", icon: "▦", component: Dashboard },
  { name: "Orders", icon: "▤", component: OrderList },
  { name: "Menu", icon: "☷", component: Menu_Edit },
  { name: "Staff", icon: "♙", component: Staffs },
  { name: "Reports", icon: "▥", component: Reports },
];

export default function Admin() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [ordersCount, setOrdersCount] = useState(null);
  const ActiveComponent = navItems.find((item) => item.name === activeItem).component;

  useEffect(() => {
    let isMounted = true;

    async function loadOrdersCount() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3006/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const result = await response.json();
        const count = Number.isFinite(Number(result.count))
          ? Number(result.count)
          : Array.isArray(result.data)
            ? result.data.length
            : Array.isArray(result)
              ? result.length
              : 0;
        if (isMounted) setOrdersCount(count);
      } catch {
      }
    }

    loadOrdersCount();
    const timer = setInterval(loadOrdersCount, 30000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="#admin" aria-label="Bistro Dev admin home">
          <span className="admin-brand-mark">B</span>
          <span><strong>Bistro Dev</strong><small>ADMIN CONSOLE</small></span>
        </a>

        <div className="admin-nav-label">WORKSPACE</div>
        <nav className="admin-nav" aria-label="Admin sections">
          {navItems.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`admin-nav-item ${activeItem === item.name ? "active" : ""}`}
              onClick={() => setActiveItem(item.name)}
              aria-current={activeItem === item.name ? "page" : undefined}
            >
              <span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>
              {item.name}
              {item.name === "Orders" && <span className="admin-nav-count">{ordersCount ?? "…"}</span>}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-user-avatar">AD</div>
          <span><strong>Admin</strong><small>Administrator</small></span>
          <span className="admin-user-menu" aria-hidden="true">···</span>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">Bistro Dev <span>/</span> <strong>{activeItem}</strong></div>
        </header>
        <div className="admin-page-content">
          <ActiveComponent />
        </div>
      </section>
    </div>
  );
}
