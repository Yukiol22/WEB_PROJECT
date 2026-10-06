'use strict'
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="restaurant-info">
        <div className="restaurant-info-content">
          <div>
            <h3>Bistro Dev</h3>
            <p>Freshly prepared food and a welcoming place to eat.</p>
          </div>
          <div>
            <h4>Visit Us</h4>
            <p>Mannerheimintie 10</p>
            <p>Helsinki, Finland</p>
          </div>
          <div>
            <h4>Opening Hours</h4>
            <p>Monday - Friday: 11:00 AM - 9:00 PM</p>
            <p>Saturday - Sunday: 12:00 PM - 10:00 PM</p>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>@ 2026 Metropolia - Oliver, Hussein, Eddie, Dieudonne</p>
      </div>
    </footer>
  );
}
