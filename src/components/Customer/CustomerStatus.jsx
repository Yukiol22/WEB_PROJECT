
import "./CustomerStatus.css";

const steps = ["New Order", "Preparing", "Ready to Pick Up", "Completed"];

export function CustomerStatus({ order }) {
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="customer-container">
      <div className="status-card">
        <div className="header">
          <span className="order-id">Order #{order.order_id}</span>
          <h1 className="title">Track Your Order</h1>
        </div>

        {/* Dynamic Status Banner */}
        <div
          className={`status-banner ${order.status === "Ready to Pick Up" ? "is-ready" : ""}`}
        >
          <span className="banner-icon">
            {order.status === "Ready to Pick Up" ? "🎉" : "👨‍🍳"}
          </span>
          <div>
            <h3 className="banner-title">
              {order.status === "Ready to Pick Up"
                ? "Your Order is Ready for Pickup!"
                : `Status: ${order.status}`}
            </h3>
            <p className="banner-desc">
              {order.status === "Ready to Pick Up"
                ? "Please head to the counter to collect your meal."
                : "Our kitchen is working on your order."}
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="progress-tracker">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step}
                className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
              >
                <div className="node">{isCompleted ? "✓" : idx + 1}</div>
                <span className="label">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Order Details */}
        <div className="items-box">
          <h3>Order Details</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="item-row">
              <span>
                {item.quantity}x {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
