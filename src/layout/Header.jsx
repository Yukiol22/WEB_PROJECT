export default function Header({ currentPage, setCurrentPage, onOpenAuth }) {
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
        <button
          type="button"
          onClick={() => setCurrentPage("admin")}
          className={`nav-link ${currentPage === "admin" ? "active" : ""}`}>
          Admin Portal
        </button>
      </nav>

      <div className="actions">
        <button className="cart-btn">🛒 Cart (2)</button>
        <button
          className="login-btn"
          onClick={onOpenAuth}>
          Login / Register
        </button>
      </div>
    </header>
  );
}
