import React from 'react';
import { NavLink } from 'react-router-dom';

const CustomerFooter = () => {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img
                src="https://chhabrasports.com/wp-content/uploads/2025/09/csa-acrylic-letter-cutting-scaled-e1756718460651.jpg"
                alt="Chhabra Sports Logo"
                style={{ height: '38px', borderRadius: '4px' }}
              />
            </div>
            <p>India's leading online racquet and sports gear store since 1998 — supplying genuine equipment to athletes nationwide.</p>
            <div className="foot-social">
              <a href="#instagram" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /></svg>
              </a>
              <a href="#facebook" aria-label="Facebook">
                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="#youtube" aria-label="YouTube">
                <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="3" /><polygon points="10 9 15 12 10 15" /></svg>
              </a>
            </div>
          </div>

          <div className="foot-col">
            <h5>Sports Store</h5>
            <NavLink to="/products">Badminton Racquets</NavLink>
            <NavLink to="/products">Tennis Racquets</NavLink>
            <NavLink to="/products">Cricket Equipment</NavLink>
            <NavLink to="/products">Non-Marking Shoes</NavLink>
            <NavLink to="/products">Football Boots</NavLink>
          </div>

          <div className="foot-col">
            <h5>Customer Service</h5>
            <a href="tel:+917277252440">Phone: +91-72772-52440</a>
            <a href="mailto:chhabrasportspatna@outlook.com">Email: chhabrasportspatna@outlook.com</a>
            <a href="#stringing">Stringing Service</a>
            <NavLink to="/profile">Track Order</NavLink>
          </div>

          <div className="foot-col">
            <h5>Store Address</h5>
            <a href="#address">L. B. Shop No. 10, Boring Road,</a>
            <a href="#address">Patna, Bihar – 800001</a>
            <a href="#address">Mon - Sat: 10:00 AM - 8:30 PM</a>
          </div>

          <div className="foot-col">
            <h5>Legal & Trust</h5>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#returns">Return Policy</a>
            <a href="#warranty">100% Genuine Warranty</a>
          </div>
        </div>

        <div className="foot-bottom">
          <span>&copy; 2026 Chhabra Sports. All Rights Reserved. Inspired by top racquet stores across India.</span>
          <div className="pay-icons">
            <span>UPI / GPAY</span>
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>NETBANKING</span>
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;
