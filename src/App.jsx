// import Header from './layout/Header';
// import Content from './layout/Content';
// import Footer from './layout/Footer';
import { useState } from "react";
import { OrderList } from "../src/components/Customer/OrderList";
import { CustomerStatus } from "../src/components/Customer/CustomerStatus";

export default function App() {
  const [customerOrder, setCustomerOrder] = useState({
    order_id: 5552375,
    customer_name: "John Doe",
    status: "Preparing",
    items: [
      { name: "Double Cheeseburger", quantity: 2 },
      { name: "French Fries", quantity: 1 },
    ],
  });

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    if (orderId === customerOrder.order_id) {
      setCustomerOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
    >
      {/* Left: Staff Dashboard */}
      <div>
        <OrderList onUpdateOrderStatus={handleUpdateOrderStatus} />
      </div>

      {/* Right: Customer View (Updates when staff clicks 'Mark as Ready') */}
      <div>
        <CustomerStatus order={customerOrder} />
      </div>
    </div>
  );
}