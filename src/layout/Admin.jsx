import { useState } from "react";
import "./Admin.css";
import Dashboard from "../components/Admin/Dashboard";
import Staffs from "../components/Admin/Staffs";
import Reports from "../components/Admin/Reports";
import Menu_Edit from "../components/Admin/Menu_Edit";
import OrderList from "../components/Admin/OrderList";

const navItems = [
  { name: "Dashboard", icon: "▦", component: Dashboard },
  { name: "Orders", icon: "▤", component: OrderList },
  { name: "Menu", icon: "☷", component: Menu_Edit },
  { name: "Staff", icon: "♙", component: Staffs },
  { name: "Reports", icon: "▥", component: Reports },
];

export default function Admin() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const ActiveComponent = navItems.find((item) => item.name === activeItem).component;

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
              {item.name === "Orders" && <span className="admin-nav-count">3</span>}
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
