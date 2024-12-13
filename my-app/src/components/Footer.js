// footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-separator"></div>
      <div className="footer-gradient"></div>
      <div className="container">
        {/* Brand Section */}
        <div className="footer-content">
          <div className="footer-section brand-section">
            <h4>Elegance</h4>
            <p>Crafting timeless pieces that celebrate life's precious moments. Our commitment to excellence brings you the finest jewelry.</p>
            <div className="contact-info">
              <p><Phone size={16} /> +1 (800) 123-4567</p>
              <p><Mail size={16} /> contact@elegance.com</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-links-group">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/collections">Collections</Link></li>
                <li><Link to="/about">Our Story</Link></li>
                <li><Link to="/care">Jewelry Care</Link></li>
                <li><Link to="/custom">Custom Orders</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Customer Care</h4>
              <ul>
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/returns">Returns & Exchanges</Link></li>
                <li><Link to="/sizing">Size Guide</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="footer-section newsletter-section">
            <h4>Stay Connected</h4>
            <div className="newsletter">
              <input type="email" placeholder="Subscribe to our newsletter" />
              <button className="subscribe-btn">Subscribe</button>
            </div>
            <div className="social-links">
              <a href="https://instagram.com" aria-label="Instagram"><Instagram /></a>
              <a href="https://facebook.com" aria-label="Facebook"><Facebook /></a>
              <a href="https://twitter.com" aria-label="Twitter"><Twitter /></a>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; 2024 Elegance. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;