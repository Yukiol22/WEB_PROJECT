import { useState } from "react";
import HslLayout from "./Map/HslLayout";
import "./Home.css";
import menuData from "./data/menu.json";

const API = import.meta.env?.VITE_API_URL || "http://localhost:3006/api";

export default function Home({ setCurrentPage, onAddToCart }) {

  const [showMap, setShowMap] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const dailyItems = menuData.filter((item) => item.daily === true);
  const featuredItems = dailyItems.length ? dailyItems : menuData.slice(0, 3);

  async function handleFeedbackSubmit() {
    const token = localStorage.getItem("token");
    if (!token) {
      setFeedbackError("Please sign in before sending feedback.");
      return;
    }
    if (!rating || !feedback.trim()) {
      setFeedbackError("Choose a star rating and write a comment.");
      return;
    }

    setSendingFeedback(true);
    setFeedbackError("");
    try {
      const response = await fetch(`${API}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment: feedback.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.message || "Could not send feedback.");

      setFeedbackSent(true);
      setRating(0);
      setFeedback("");
    } catch (error) {
      setFeedbackError(error.message || "Could not connect to the server.");
    } finally {
      setSendingFeedback(false);
    }
  }

  return (
    <section className="home">
      {/* HERO */}
      <div className="home-hero">
        <button
          className="home-menu-btn"
          onClick={() => setCurrentPage("menu")}
        >
          View Menu
        </button>
      </div>

      {/* TODAY'S MENU */}
      <div className="daily-menu">
        <h2>🍽️ Today's Menu</h2>

        <div className="grid">
          {featuredItems.map((item) => (
              <div
                key={item.id}
                className={`card ${
                  item.highlighted ? "highlighted" : ""
                }`}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-img"
                  />
                )}

                <div className="card-header">
                  <h4>{item.title}</h4>
                  <span className="price">{item.price}</span>
                </div>

                <p className="card-desc">
                  {item.description}
                </p>

                <div className="card-footer">
                  <div className="tags">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="add-btn" type="button" onClick={() => onAddToCart?.({ ...item, price: Number(String(item.price).replace(/[^0-9.]/g, "")) })}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ABOUT BISTRO DEV */}
      <section className="about-section">
        <div className="about-content">
          <span className="about-small">
            BISTRO DEV
          </span>

          <h2>About Bistro Dev</h2>

          <p>Freshly prepared food, friendly service, and a welcoming place to enjoy a meal.</p>

          <div className="about-info">
            <div>
              <span>📍</span>
              <h4>Location</h4>
              <p>Open the map below to find us.</p>
            </div>

            <div>
              <span>🕐</span>
              <h4>Opening Hours</h4>
              <p>Check with us for today's opening hours.</p>
            </div>

            <div>
              <span>🍽️</span>
              <h4>Fresh Daily</h4>
              <p>We prepare each order fresh when you visit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="feedback-section">
        <div className="feedback-card">
          <h2>⭐ Share Your Feedback</h2>

          <p>Tell us how we did.</p>

          <div className="feedback-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${
                  star <= rating ? "selected" : ""
                }`}
                onClick={() => {
                  setRating(star);
                  setFeedbackSent(false);
                  setFeedbackError("");
                }}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            className="feedback-textarea"
            maxLength={2000}
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              setFeedbackSent(false);
              setFeedbackError("");
            }}
          ></textarea>

          <button
            type="button"
            className="feedback-submit"
            disabled={rating === 0 || !feedback.trim() || sendingFeedback}
            onClick={handleFeedbackSubmit}
          >
            {sendingFeedback ? "Sending..." : "Send Feedback"}
          </button>

          {feedbackError && <p className="feedback-error" role="alert">{feedbackError}</p>}

          {feedbackSent && (
            <p className="feedback-success">
              Thanks for your feedback! ❤️
            </p>
          )}
        </div>
      </section>

      {/* LOCATION / MAP */}
      <div className="home-location">
        <button
          className="location-btn"
          onClick={() => setShowMap(!showMap)}
        >
          📍 Restaurant Location
          <span>{showMap ? "▲" : "▼"}</span>
        </button>

        {showMap && <HslLayout />}
      </div>
    </section>
  );
}
