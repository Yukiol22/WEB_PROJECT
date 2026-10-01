import HslLayout from '../components/Map/HslLayout';
import Menu from "../components/Menu";
import { OrderList as KitchenOrderList } from "../components/Kitchen/OrderList";
import MyOrders from "../components/Customer/MyOrders";
import Admin from "./Admin";
import Payment from "./Payment";
import "./Content.css";

export default function Content({ currentPage, onAddToCart }) {
  return (
    <main className={`content-container ${currentPage === "admin" ? "admin-content" : ""} ${currentPage === "kitchen" ? "kitchen-content" : ""}`}>
      {currentPage === "admin" ? (
        <Admin />
      ) : currentPage === "kitchen" ? (
        <KitchenOrderList />
      ) : currentPage === "orders" ? (
        <MyOrders />
      ) : currentPage === "menu" ? (
        <Menu onAddToCart={onAddToCart} />
      ) : currentPage === "payment" ? (
        <Payment />
      ) : (
        <section className="section">
          <h3>📍 Restaurant Location</h3>
          <HslLayout />
        </section>
      )}
    </main>
  );
}
