import { useState } from "react";
import "./AuthModal.css";


export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const url = isLogin
      ? "http://localhost:3006/api/auth/login"
      : "http://localhost:3006/api/auth/register";

    const body = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || data.error || "Something went wrong.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage(
        isLogin
          ? "Login successful!"
          : "Account created successfully!"
      );

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Authentication error:", error);
      setMessage("Could not connect to the server.");
    }
  };

  return (
    <div
      className="auth-overlay"
      onClick={onClose}
    >
      <div
        className="auth-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="auth-close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-btn ${isLogin ? "active" : ""}`}
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
          >
            Login
          </button>

          <button
            type="button"
            className={`tab-btn ${!isLogin ? "active" : ""}`}
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
          >
            Register
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
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
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
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
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />
          </div>

          {message && <p>{message}</p>}

          <button
            type="submit"
            className="submit-btn"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}