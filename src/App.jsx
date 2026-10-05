import { useEffect, useState } from "react";
import Header from "./layout/Header";
import Content from "./layout/Content";
import Footer from "./layout/Footer";
import AuthModal from "./components/AuthModal";
import CartModal from "./components/Customer/CartModal";
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

function getCartStorageKey(account) {
  const accountId = account?.userId ?? account?.id ?? account?.email;
  return accountId ? `restaurant-cart-${accountId}` : null;
}

function getSavedCart(account) {
  const key = getCartStorageKey(account);
  if (!key) return [];

  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => getPageFromPath(window.location.pathname));
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  });
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      return getSavedCart(savedUser);
    } catch {
      return [];
    }
  });
  const role = String(user?.role || "").toLowerCase();
  const isAdmin = role === "admin" && user?.demo !== true;
  const isChef = role === "chef";
  const isCustomer = role === "customer";

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
    const key = getCartStorageKey(user);
    if (key) localStorage.setItem(key, JSON.stringify(cartItems));
  }, [user, cartItems]);

  function handleAuthenticated(authenticatedUser) {
    setCartItems(getSavedCart(authenticatedUser));
    setUser(authenticatedUser);
  }

  function handleSignOut() {
    setIsCartOpen(false);
    setCartItems([]);
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    setUser(null);
    navigateToPage("home");
  }

  useEffect(() => {
    function handleBrowserNavigation() {
      const page = getPageFromPath(window.location.pathname);
      setCurrentPage((page === "admin" && !isAdmin) || (page === "kitchen" && !isChef) || (page === "orders" && !isCustomer) ? "home" : page);
    }
    window.addEventListener("popstate", handleBrowserNavigation);
    return () => window.removeEventListener("popstate", handleBrowserNavigation);
  }, [isAdmin, isChef, isCustomer]);

  function navigateToPage(page) {
    if ((page === "admin" && !isAdmin) || (page === "kitchen" && !isChef) || (page === "orders" && !isCustomer)) page = "home";
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
        setCurrentPage={navigateToPage}
        user={user}
        isAdmin={isAdmin}
        isChef={isChef}
        isCustomer={isCustomer}
        onSignOut={handleSignOut}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      <Content currentPage={currentPage} onAddToCart={addToCart} isAdmin={isAdmin} isChef={isChef} isCustomer={isCustomer} cartItems={cartItems} onPaid={(orderId) => { localStorage.setItem("customerOrderId", String(orderId)); setCartItems([]); }} onBackToMenu={() => navigateToPage("menu")} />
      <Footer />
      <CartModal isOpen={isCartOpen} items={cartItems} onClose={() => setIsCartOpen(false)} onChangeQuantity={changeCartQuantity} onGoToCheckout={goToCheckout} />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
}

