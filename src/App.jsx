import { useState } from "react";
import Header from "./layout/Header";
import Content from "./layout/Content";
import Footer from "./layout/Footer";
import LoginSignup from "./LoginSignup/LoginSignup";
import AuthModal from "./components/AuthModal";
import "./App.css";

const pagePaths = {
  home: "/",
  menu: "/menu",
  orders: "/orders",
  admin: "/admin",
  kitchen: "/kitchen",
  payment: "/payment",
};

function getPageFromPath(pathname) {
  return Object.entries(pagePaths).find(([, path]) => path === pathname)?.[0] || "home";
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => getPageFromPath(window.location.pathname));
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  function addToCart(item) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    function handleBrowserNavigation() {
      setCurrentPage(getPageFromPath(window.location.pathname));
    }
    window.addEventListener("popstate", handleBrowserNavigation);
    return () => window.removeEventListener("popstate", handleBrowserNavigation);
  }, []);

  function navigateToPage(page) {
    const path = pagePaths[page] || "/";
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setCurrentPage(pagePaths[page] ? page : "home");
  }

  function changeCartQuantity(itemId, change) {
    setCartItems((currentItems) => currentItems
      .map((item) => item.id === itemId
        ? { ...item, quantity: item.quantity + change }
        : item)
      .filter((item) => item.quantity > 0));
  }

  function goToCheckout() {
    setIsCartOpen(false);
    navigateToPage("payment");
  }

  return (
    <div className="app-container">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      <Content currentPage={currentPage} />
      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

