'use strict'
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <span className="logo-icon">🍽️</span>
        <h1 className="logo-text">Bistro Dev</h1>
      </div>

      <nav className="nav">
        <a href="#home" className="nav-link active">Home</a>
        <a href="#menu" className="nav-link">Menu & Lunch</a>
        <a href="#admin" className="nav-link">Admin Portal</a>
      </nav>

      <div className="actions">
        <button className="cart-btn">🛒 Cart (2)</button>
        <button className="login-btn">Login / Register</button>
      </div>
    </header>
  );
}