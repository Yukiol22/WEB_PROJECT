import { useState } from "react";
import "./AuthModal.css";

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <div
      className="auth-overlay"
      onClick={onClose}>
      <div
        className="auth-card"
        onClick={(e) => e.stopPropagation()}>
        <button
          className="auth-close"
          onClick={onClose}>
          ✕
        </button>

        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button
            type="button"
            className={`tab-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="submit-btn">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
