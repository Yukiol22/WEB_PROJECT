import { useState } from "react";
import "./Payment.css";

const API = import.meta.env?.VITE_API_URL || "http://localhost:3006/api";

export default function Payment({ items = [], onPaid, onBack }) {
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  async function pay() {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in before placing your order.");
      return;
    }
    if (items.length === 0) return;

    setPlacingOrder(true);
    setError("");
    try {
      const response = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderType: "pickup",
          items: items.map((item) => ({ itemId: item.id, quantity: item.quantity })),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.message || "Could not place your order.");

      const createdOrderId = data.order?.orderId;
      if (!createdOrderId) throw new Error("The server did not return an order number.");
      setOrderId(createdOrderId);
      onPaid?.(createdOrderId);
    } catch (requestError) {
      setError(requestError.message || "Could not connect to the server.");
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <section className="payment-page">
      <div className={`payment-card ${orderId ? "payment-success" : ""}`}>
        {orderId ? (
          <>
            <h1>Order placed!</h1>
            <button type="button" onClick={onBack}>Back to menu</button>
          </>
        ) : (
          <>
            <h1>Checkout</h1>
            {items.length === 0 ? (
              <>
                <p>Your cart is empty.</p>
                <button type="button" onClick={onBack}>Back to menu</button>
              </>
            ) : (
              <>
                <div className="payment-items">
                  {items.map((item) => (
                    <div className="payment-item" key={item.id}>
                      <span>{item.quantity} x {item.title}</span>
                      <span>€{(Number(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="payment-total"><span>Total</span><strong>€{total.toFixed(2)}</strong></div>
                {error && <p className="payment-error" role="alert">{error}</p>}
                <button type="button" className="payment-pay-button" onClick={pay} disabled={placingOrder}>
                  {placingOrder ? "Placing order..." : `Pay €${total.toFixed(2)}`}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}