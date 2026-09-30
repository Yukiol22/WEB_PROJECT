import { useState } from "react";
import "./OrderList.css";

const initialOrdersFromDB = [
  {
    order_id: 5552375,
    pickup_time: "2026-03-26T02:12:00",
    customer_name: "Emilia Johanson",
    location: "Table 12",
    total_amount: 251.16,
    status: "On Delivery",
  },
  {
    order_id: 5552356,
    pickup_time: "2026-03-26T00:42:00",
    customer_name: "Rendy Greenlee",
    location: "Counter Pickup",
    total_amount: 44.99,
    status: "New Order",
  },
  {
    order_id: 5552388,
    pickup_time: "2026-03-26T00:42:00",
    customer_name: "Jessica Wong",
    location: "Table 04",
    total_amount: 24.17,
    status: "Completed",
  },
  {
    order_id: 5552323,
    pickup_time: "2026-03-26T00:42:00",
    customer_name: "Veronica",
    location: "Table 08",
    total_amount: 74.92,
    status: "Cancelled",
  },
];

export default function OrderList() {
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Today");

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Maps order status string to CSS modifier class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "new order":
        return "status-new";
      case "on delivery":
        return "status-delivery";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  const filteredOrders = initialOrdersFromDB.filter((order) => {
    if (selectedStatus !== "All Status" && order.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="order-list-container">
      {/* Header & Dark Pill Filters */}
      <div className="order-list-header">
        <h2 className="title">Orders</h2>

        <div className="filter-controls">
          <div className="select-wrapper">
            <span className="icon">⚡</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All Status">All Status</option>
              <option value="New Order">New Order</option>
              <option value="On Delivery">On Delivery</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="select-wrapper">
            <span className="icon">📅</span>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="filter-select"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dark Modern Table */}
      <div className="table-card">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Pickup Time</th>
              <th>Customer</th>
              <th>Location</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.order_id}>
                <td className="order-id">#{order.order_id}</td>
                <td className="order-date">{formatDate(order.pickup_time)}</td>
                <td className="customer-name">{order.customer_name}</td>
                <td className="location">{order.location}</td>
                <td className="amount">${order.total_amount.toFixed(2)}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(order.status)}`}
                  >
                    <span className="dot">●</span> {order.status}
                  </span>
                </td>
                <td className="actions">•••</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
