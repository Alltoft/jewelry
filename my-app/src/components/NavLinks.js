import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  ChevronDown, 
  ShoppingBag, 
  Heart, 
  User, 
  Crown,
  Diamond,
  GemIcon,
  Watch,
  Diamond as Ring
} from 'lucide-react';
import Logout from './Logout';
import './NavLinks.css';

const NavLinks = () => {
  const { user } = useContext(AuthContext);

  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <nav className="luxury-nav">
      <div className="nav-section main-nav">
        <div className="nav-group">
          <Link to="/" className="nav-logo">
            <Diamond className="logo-icon" />
            <span>MERAL</span>
          </Link>
          
          <div className="nav-links primary-links">
            <div className="dropdown">
              <Link className="nav-link">
                Collections <ChevronDown className="dropdown-icon" />
              </Link>
              <div className="mega-menu">
                <div className="menu-grid">
                  <div className="menu-category">
                    <h4><Ring className="category-icon" /> Fine Jewelry</h4>
                    <Link to="/collections/rings">Rings</Link>
                    <Link to="/collections/necklaces">Necklaces</Link>
                    <Link to="/collections/earrings">Earrings</Link>
                    <Link to="/collections/bracelets">Bracelets</Link>
                  </div>
                  
                  <div className="menu-category">
                    <h4><Watch className="category-icon" /> Timepieces</h4>
                    <Link to="/collections/luxury-watches">Luxury Watches</Link>
                    <Link to="/collections/limited-editions">Limited Editions</Link>
                    <Link to="/collections/watch-accessories">Accessories</Link>
                  </div>
                  
                  <div className="menu-category">
                    <h4><GemIcon className="category-icon" /> High Jewelry</h4>
                    <Link to="/collections/high-jewelry">Haute Joaillerie</Link>
                    <Link to="/collections/bridal">Bridal Collection</Link>
                    <Link to="/collections/bespoke">Bespoke Pieces</Link>
                  </div>
                </div>
                
                <div className="featured-section">
                  <div className="featured-card">
                    <h5>New Arrivals</h5>
                    <Link to="/new-arrivals" className="featured-link">
                      Discover Latest Pieces
                      <span className="new-badge">New</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <Link to="/store" className="nav-link">Store</Link>
            <Link to="/about" className="nav-link">About</Link>
            
            {user?.user_role === 'VIP' && (
              <Link to="/vip" className="nav-link vip-link">
                <Crown className="vip-icon" />
                VIP Access
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="nav-section secondary-nav">
        <div className="nav-actions">
          {(!user || user.user_role !== 'Seller') && (
            <>
              <Link to="/wishlist" className="icon-button">
                <Heart className="action-icon" />
              </Link>
              <Link to="/cart" className="icon-button">
                <ShoppingBag className="action-icon" />
              </Link>
            </>
          )}
          
          <div className="nav-divider"></div>
          
          {user ? (
            <div className="dropdown account-dropdown">
              <button className="account-button">
                <User className="action-icon" />
                <span>{user.name}</span>
                <ChevronDown className="dropdown-icon" />
              </button>
              <div className="dropdown-menu">
                <div className="menu-header">
                  <span className="user-name">My Account</span>
                  <span className="user-email">{user.email}</span>
                </div>
                <div className="menu-items">
                  {user.user_role === 'Customer' && (
                    <>
                      <Link to="/account/dashboard">Dashboard</Link>
                      <Link to="/account/orders">Orders</Link>
                      <Link to="/account/appointments">Appointments</Link>
                      <Link to="/account/wishlist">Saved Items</Link>
                      <Link to="/account/profile">Profile Settings</Link>
                    </>
                  )}
                  {user.user_role === 'Seller' && (
                    <Link to="/seller">Seller Dashboard</Link>
                  )}
                </div>
                <div className="menu-divider"></div>
                <div className="menu-footer">
                  <Logout onLogout={handleLogout} className="logout-button" />
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-button">Login</Link>
              <Link to="/register" className="auth-button">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavLinks;