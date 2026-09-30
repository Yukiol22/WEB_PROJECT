import { useState } from "react";
import { CustomerStatus } from "./components/Customer/CustomerStatus";
import { OrderList } from "./components/Customer/OrderList";
import "./App.css";

export default function App() {
  const [order, setOrder] = useState({
    order_id: 5552375,
    status: "Preparing",
    items: [
      { name: "Double Cheeseburger", quantity: 2 },
      { name: "French Fries", quantity: 1 },
    ],
  });

  function updateOrderStatus(orderId, status) {
    if (orderId === order.order_id) {
      setOrder((currentOrder) => ({ ...currentOrder, status }));
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      <OrderList onUpdateOrderStatus={updateOrderStatus} />
      <CustomerStatus order={order} />
    </div>
  );
}
