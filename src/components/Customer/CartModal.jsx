import "./CartModal.css";

export default function CartModal({ isOpen, items, onClose, onChangeQuantity, onGoToCheckout }) {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <section
        className="cart-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="cart-modal-header">
          <div>
            <h2 id="cart-modal-title">Your Cart</h2>
            <p>{items.reduce((count, item) => count + item.quantity, 0)} items</p>
          </div>
          <button type="button" className="cart-modal-close" onClick={onClose} aria-label="Close cart">×</button>
        </header>

        {items.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  {item.image && <img src={item.image} alt="" />}
                  <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <p>€{Number(item.price).toFixed(2)} each</p>
                    <div className="cart-quantity-controls" aria-label={`Quantity for ${item.title}`}>
                      <button type="button" onClick={() => onChangeQuantity(item.id, -1)} aria-label={`Remove one ${item.title}`}>−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => onChangeQuantity(item.id, 1)} aria-label={`Add one ${item.title}`}>+</button>
                    </div>
                  </div>
                  <strong className="cart-item-total">€{(Number(item.price) * item.quantity).toFixed(2)}</strong>
                </article>
              ))}
            </div>
            <footer className="cart-modal-footer">
              <div className="cart-total-line"><span>Total</span><strong>€{total.toFixed(2)}</strong></div>
              <button type="button" className="checkout-button" onClick={onGoToCheckout}>Go to checkout</button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
