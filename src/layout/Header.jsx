import "./Header.css"
export default function Header({ currentPage, setCurrentPage, cartCount = 0, onOpenCart, onOpenAuth }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="logo-icon">🍽️</span>
        <h1 className="logo-text">Bistro Dev</h1>
      </div>

      <nav className="nav">
        <a
          href="/"
          onClick={(event) => { event.preventDefault(); setCurrentPage("home"); }}
          className={`nav-link ${currentPage === "home" ? "active" : ""}`}>
          Home
        </a>
        <a
          href="/menu"
          onClick={(event) => { event.preventDefault(); setCurrentPage("menu"); }}
          className={`nav-link ${currentPage === "menu" ? "active" : ""}`}>
          Menu & Lunch
        </a>
        <a
          href="/orders"
          onClick={(event) => { event.preventDefault(); setCurrentPage("orders"); }}
          className={`nav-link ${currentPage === "orders" ? "active" : ""}`}>
          My Orders
        </a>
        <a
          href="/admin"
          onClick={(event) => { event.preventDefault(); setCurrentPage("admin"); }}
          className={`nav-link ${currentPage === "admin" ? "active" : ""}`}>
          Admin Portal
        </a>
        <a
          href="/kitchen"
          onClick={(event) => { event.preventDefault(); setCurrentPage("kitchen"); }}
          className={`nav-link ${currentPage === "kitchen" ? "active" : ""}`}>
          Kitchen Portal
        </a>
      </nav>

      <div className="actions">
        <button className="cart-btn" type="button" onClick={onOpenCart}>
          🛒 Cart ({cartCount})
        </button>
        <button
          className="login-btn"
          onClick={onOpenAuth}>
          Login / Register
        </button>
      </div>
    </header>
  );
}
