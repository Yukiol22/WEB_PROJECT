import HslLayout from '../components/Map/HslLayout';
import Menu from "../components/Menu";
import { OrderList as KitchenOrderList } from "../components/Kitchen/OrderList";
import MyOrders from "../components/Customer/MyOrders";
import Home from "../components/Home";
import Admin from "./Admin";
import Payment from "./Payment";
import "./Content.css";

export default function Content({ currentPage, onAddToCart, isAdmin = false, isChef = false, isCustomer = false, cartItems = [], onPaid, onBackToMenu }) {
  return (
    <main className={`content-container ${currentPage === "home" ? "home-content" : ""} ${currentPage === "admin" ? "admin-content" : ""} ${currentPage === "kitchen" ? "kitchen-content" : ""}`}>
      {(currentPage === "admin" && !isAdmin) || (currentPage === "kitchen" && !isChef) || (currentPage === "orders" && !isCustomer) ? (
        <section className="section"><h2>Access restricted</h2><p>This page is only available to the appropriate account role.</p></section>
      ) : currentPage === "admin" && !isAdmin ? (
        <section className="section"><h2>Admin access required</h2><p>Sign in with an administrator account to open this page.</p></section>
      ) : currentPage === "admin" ? (
        <Admin />
      ) : currentPage === "kitchen" ? (
        <KitchenOrderList />
      ) : currentPage === "orders" ? (
        <MyOrders />
      ) : currentPage === "home" ? (
        <Home setCurrentPage={onBackToMenu} onAddToCart={onAddToCart} />
      ) : currentPage === "menu" ? (
        <Menu onAddToCart={onAddToCart} />
      ) : currentPage === "payment" ? (
        <Payment items={cartItems} onPaid={onPaid} onBack={onBackToMenu} />
      ) : (
        <section className="section">
          <h3>📍 Restaurant Location</h3>
          <HslLayout />
        </section>
      )}
    </main>
  );
}
