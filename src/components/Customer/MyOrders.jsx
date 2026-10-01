import "./MyOrders.css";

const demoOrders = [
  {
    id: "5552375",
    status: "Preparing",
    date: "Today, 14:12",
    pickup: "14:30",
    total: "€25.97",
    items: ["2 × Double Cheeseburger", "1 × French Fries"],
  },
  {
    id: "5552374",
    status: "Completed",
    date: "Yesterday, 12:46",
    pickup: "13:00",
    total: "€14.50",
    items: ["1 × Margherita Pizza"],
  },
];

export default function MyOrders() {
  return (
    <section className="my-orders">
      <div className="my-orders-heading">
        <div>
          <p className="my-orders-eyebrow">YOUR ACCOUNT</p>
          <h1>My Orders</h1>
          <p>Check your order status and pickup details.</p>
        </div>
        <span className="my-orders-demo">DEMO ORDERS</span>
      </div>

      <div className="my-orders-list">
        {demoOrders.map((order) => (
          <article className="my-order-card" key={order.id}>
            <div className="my-order-top">
              <div>
                <span className="my-order-number">Order #{order.id}</span>
                <span className="my-order-date">{order.date}</span>
              </div>
              <span className={`my-order-status ${order.status.toLowerCase()}`}>
                <span aria-hidden="true">●</span> {order.status}
              </span>
            </div>

            <div className="my-order-items">
              {order.items.map((item) => <p key={item}>{item}</p>)}
            </div>

            <div className="my-order-bottom">
              <span>Pickup <strong>{order.pickup}</strong></span>
              <strong className="my-order-total">{order.total}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
