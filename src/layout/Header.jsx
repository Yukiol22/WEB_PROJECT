import "./Header.css";
export default function Header({ currentPage, setCurrentPage, cartCount = 0, onOpenCart, onOpenAuth, user, isAdmin, isChef, isCustomer, onSignOut }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="logo-icon">🍽️</span>
        <h1 className="logo-text">Bistro Dev</h1>
      </div>

      <nav className="nav">
        <button
          type="button"
          onClick={() => setCurrentPage("home")}
          className={`nav-link ${currentPage === "home" ? "active" : ""}`}>
          Home
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage("menu")}
          className={`nav-link ${currentPage === "menu" ? "active" : ""}`}>
          Menu & Lunch
        </button>
        {isAdmin && (<button type="button" onClick={() => setCurrentPage("admin")} className={`nav-link ${currentPage === "admin" ? "active" : ""}`}>Admin Portal</button>)}
        {isCustomer && <button type="button" onClick={() => setCurrentPage("orders")} className={`nav-link ${currentPage === "orders" ? "active" : ""}`}>My Orders</button>}
        {isChef && (<a
          href="/kitchen"
          onClick={(event) => { event.preventDefault(); setCurrentPage("kitchen"); }}
          className={`nav-link ${currentPage === "kitchen" ? "active" : ""}`}>
          Kitchen Portal
        </a>)}
      </nav>

      <div className="actions">
        <button type="button" className="cart-btn" onClick={onOpenCart}>Cart ({cartCount})</button>
        {user ? (<button type="button" className="login-btn" onClick={onSignOut}>Sign out</button>) : (<button type="button" className="login-btn" onClick={onOpenAuth}>Login / Register</button>)}
      </div>
    </header>
  );
};