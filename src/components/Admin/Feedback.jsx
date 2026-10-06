import { useEffect, useState } from "react";
import "./Feedback.css";

const FEEDBACK_URL = "http://localhost:3006/api/admin/feedback";

export default function Feedback() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFeedback() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Sign in with an admin account to view feedback.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(FEEDBACK_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || data.message || "Could not load feedback.");
        if (isMounted) setEntries(Array.isArray(data) ? data : []);
      } catch (requestError) {
        if (isMounted) setError(requestError.message || "Could not connect to the server.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFeedback();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="admin-feedback">
      <header className="admin-feedback-header">
        <div>
          <p className="admin-feedback-eyebrow">CUSTOMER VOICE</p>
          <h1>Customer Feedback</h1>
          <p>Ratings and comments submitted by customers.</p>
        </div>
        <span className="admin-feedback-count">{entries.length} {entries.length === 1 ? "response" : "responses"}</span>
      </header>

      {loading && <p>Loading feedback…</p>}
      {error && <p role="alert" className="admin-feedback-error">{error}</p>}
      {!loading && !error && entries.length === 0 && <p>No customer feedback yet.</p>}

      <div className="admin-feedback-list">
        {entries.map((entry) => (
          <article className="admin-feedback-card" key={entry.feedbackId}>
            <div className="admin-feedback-card-top">
              <div>
                <h2>{entry.customerName}</h2>
                <p>{entry.email || `Customer #${entry.customerId}`}</p>
              </div>
              <time dateTime={entry.createdAt}>{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "Date unavailable"}</time>
            </div>
            <div className="admin-feedback-rating" aria-label={`${entry.rating} out of 5 stars`}>
              {"★".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}
            </div>
            <p className="admin-feedback-comment">{entry.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
