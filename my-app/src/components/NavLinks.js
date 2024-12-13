// my-app/src/components/NavLinks.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  ChevronDown, 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  PhoneCall, 
  Gift, 
  Crown 
} from 'lucide-react';
import Logout from './Logout';
import './NavLinks.css';

const NavLinks = () => {
  const { user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <div className="nav-container">
      <div className="nav-section main-nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/store" className="collection-btn">Store</Link></li>
        
        <li className="dropdown">
          <Link to="/collections">
            Collections <ChevronDown size={16} />
          </Link>
          <div className="dropdown-content mega-menu">
            <div className="menu-section">
              <h4>Fine Jewelry</h4>
              <Link to="/collections/rings">Rings</Link>
              <Link to="/collections/necklaces">Necklaces</Link>
              <Link to="/collections/earrings">Earrings</Link>
              <Link to="/collections/bracelets">Bracelets</Link>
            </div>
            <div className="menu-section">
              <h4>Luxury Selection</h4>
              <Link to="/collections/watches">Watches</Link>
              <Link to="/collections/high-jewelry">High Jewelry</Link>
              <Link to="/collections/bridal">Bridal Collection</Link>
            </div>
            <div className="menu-section featured">
              <h4>Highlights</h4>
              <Link to="/new-arrivals" className="featured-link">
                New Arrivals <span className="badge">New</span>
              </Link>
              <Link to="/collections/bestsellers">Bestsellers</Link>
            </div>
          </div>
        </li>
      </div>

      <div className="nav-section center-nav">
        {user?.user_role === 'VIP' && (
          <li className="dropdown vip-menu">
            <Link to="/vip">
              <Crown size={16} /> VIP Exclusive
            </Link>
          </li>
        )}
      </div>

      <div className="nav-section end-nav">
        <div className="nav-actions">
          <li>
            <button className="nav-icon-button">
              <Search size={18} />
            </button>
          </li>
          {(!user || user.user_role !== 'Seller') && (
            <>
              <li>
                <Link to="/wishlist" className="nav-icon-button">
                  <Heart size={18} />
                </Link>
              </li>
              <li>
                <Link to="/cart" className="nav-icon-button">
                  <ShoppingBag size={18} />
                </Link>
              </li>
            </>
          )}
        </div>

        <div className="nav-divider"></div>

        {user ? (
          <li className="dropdown account-menu">
            <Link to="#" className="account-link">
              <User size={18} /> <span>Account</span> <ChevronDown size={16} />
            </Link>
            <div className="dropdown-content">
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
              <div className="dropdown-divider"></div>
              <Logout onLogout={handleLogout} className="nav-button" />
            </div>
          </li>
        ) : (
          <div className="auth-buttons">
            <li><Link to="/login" className="nav-button secondary">Login</Link></li>
            <li><Link to="/register" className="nav-button outlined">Register</Link></li>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavLinks;