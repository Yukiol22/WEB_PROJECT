import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState } from "react";

import Header from "./layout/Header";
import Content from "./layout/Content";
import Footer from "./layout/Footer";
import LoginSignup from "./LoginSignup/LoginSignup";
import AuthModal from "./components/AuthModal";

import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
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
          }
        />

        <Route
          path="/login"
          element={<LoginSignup />}
        />

      </Routes>
    </BrowserRouter>
  );
}

