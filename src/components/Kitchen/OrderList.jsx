import { useState } from "react";
import "./OrderList.css";

const initialOrders = [
  {
    order_id: 5552375,
    customer_name: "John Doe",
    status: "Preparing",
    pickup_time: "14:30",
    total_amount: 25.97,
    items: [
      { name: "Double Cheeseburger", quantity: 2 },
      { name: "French Fries", quantity: 1 },
    ],
  },
  {
    order_id: 5552376,
    customer_name: "Jane Smith",
    status: "New Order",
    pickup_time: "14:45",
    total_amount: 14.5,
    items: [{ name: "Margherita Pizza", quantity: 1 }],
  },
];

export function OrderList({ onUpdateOrderStatus }) {
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusAdvance = (orderId, currentStatus) => {
    let nextStatus = "Preparing";
    if (currentStatus === "New Order") nextStatus = "Preparing";
    else if (currentStatus === "Preparing") nextStatus = "Ready to Pick Up";
    else if (currentStatus === "Ready to Pick Up") nextStatus = "Completed";

    const updated = orders.map((ord) =>
      ord.order_id === orderId ? { ...ord, status: nextStatus } : ord,
    );

    setOrders(updated);

    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, nextStatus);
    }
  };

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <h1 className="title">Active Kitchen Orders</h1>
        <p className="subtitle">
          Update order statuses to notify waiting customers
        </p>
      </div>

      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order.order_id} className="order-card">
            <div className="card-top">
              <span className="order-id">#{order.order_id}</span>
              <span
                className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, "-")}`}
              >
                ● {order.status}
              </span>
            </div>

            <div className="customer-info">
              <p className="customer-name">{order.customer_name}</p>
              <p className="pickup-time">Est. Pickup: {order.pickup_time}</p>
            </div>

            <div className="items-summary">
              {order.items.map((it, idx) => (
                <div key={idx} className="item-line">
                  <span>{it.quantity}x</span> {it.name}
                </div>
              ))}
            </div>

            <div className="card-footer">
              <span className="order-total">
                ${order.total_amount.toFixed(2)}
              </span>
              {order.status !== "Completed" && (
                <button
                  className="advance-btn"
                  onClick={() =>
                    handleStatusAdvance(order.order_id, order.status)
                  }
                >
                  {order.status === "New Order" && "Start Preparing"}
                  {order.status === "Preparing" && "Mark as Ready"}
                  {order.status === "Ready to Pick Up" && "Complete Order"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
