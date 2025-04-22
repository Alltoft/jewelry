import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight,
  ShoppingBag, 
  Heart, 
  User, 
  Crown,
  Diamond,
  GemIcon,
  Watch,
  Diamond as Ring,
  X
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Logout from './Logout';
import './MobileNavbar.css';
import MobileMenuToggle from './MobileMenuToggle.tsx';

const MobileNavbar: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState<string | null>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = menuOpen ? 'auto' : 'hidden';
  };

  const toggleCollections = (e: React.MouseEvent) => {
    e.preventDefault();
    setCollectionsOpen(!collectionsOpen);
  };

  const toggleCategory = (category: string) => {
    setCategoryOpen(categoryOpen === category ? null : category);
  };

  const handleLogout = () => {
    window.location.reload();
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    setCollectionsOpen(false);
    setCategoryOpen(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="mobile-navbar">
      <div className="mobile-navbar-header">
        <MobileMenuToggle isOpen={menuOpen} toggleMenu={toggleMenu} />
        
        <Link to="/" className="mobile-logo" onClick={closeAllMenus}>
          <Diamond className="mobile-logo-icon" />
          <span>MERAL</span>
        </Link>
        
        <div className="mobile-actions">
          {(!user || user.user_role !== 'Seller') && (
            <>
              <Link to="/wishlist" className="mobile-icon-button" onClick={closeAllMenus}>
                <Heart className="mobile-action-icon" />
              </Link>
              <Link to="/cart" className="mobile-icon-button" onClick={closeAllMenus}>
                <ShoppingBag className="mobile-action-icon" />
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <button className="mobile-close-button" onClick={toggleMenu}>
            <X />
          </button>
        </div>
        
        <div className="mobile-menu-content">
          <div className="mobile-nav-links">
            <div className="mobile-menu-item">
              <button 
                className={`mobile-menu-button ${collectionsOpen ? 'active' : ''}`} 
                onClick={toggleCollections}
              >
                Collections
                <ChevronDown className={`mobile-chevron ${collectionsOpen ? 'rotate' : ''}`} />
              </button>
              
              {collectionsOpen && (
                <div className="mobile-submenu">
                  <div className="mobile-category">
                    <button 
                      className="mobile-category-button" 
                      onClick={() => toggleCategory('jewelry')}
                    >
                      <Ring className="mobile-category-icon" />
                      <span>Fine Jewelry</span>
                      <ChevronRight className={`mobile-chevron ${categoryOpen === 'jewelry' ? 'rotate' : ''}`} />
                    </button>
                    
                    {categoryOpen === 'jewelry' && (
                      <div className="mobile-subcategory">
                        <Link to="/collections/rings" className="mobile-link" onClick={closeAllMenus}>Rings</Link>
                        <Link to="/collections/necklaces" className="mobile-link" onClick={closeAllMenus}>Necklaces</Link>
                        <Link to="/collections/earrings" className="mobile-link" onClick={closeAllMenus}>Earrings</Link>
                        <Link to="/collections/bracelets" className="mobile-link" onClick={closeAllMenus}>Bracelets</Link>
                      </div>
                    )}
                  </div>
                  
                  <div className="mobile-category">
                    <button 
                      className="mobile-category-button" 
                      onClick={() => toggleCategory('watches')}
                    >
                      <Watch className="mobile-category-icon" />
                      <span>Timepieces</span>
                      <ChevronRight className={`mobile-chevron ${categoryOpen === 'watches' ? 'rotate' : ''}`} />
                    </button>
                    
                    {categoryOpen === 'watches' && (
                      <div className="mobile-subcategory">
                        <Link to="/collections/luxury-watches" className="mobile-link" onClick={closeAllMenus}>Luxury Watches</Link>
                        <Link to="/collections/limited-editions" className="mobile-link" onClick={closeAllMenus}>Limited Editions</Link>
                        <Link to="/collections/watch-accessories" className="mobile-link" onClick={closeAllMenus}>Accessories</Link>
                      </div>
                    )}
                  </div>
                  
                  <div className="mobile-category">
                    <button 
                      className="mobile-category-button" 
                      onClick={() => toggleCategory('high-jewelry')}
                    >
                      <GemIcon className="mobile-category-icon" />
                      <span>High Jewelry</span>
                      <ChevronRight className={`mobile-chevron ${categoryOpen === 'high-jewelry' ? 'rotate' : ''}`} />
                    </button>
                    
                    {categoryOpen === 'high-jewelry' && (
                      <div className="mobile-subcategory">
                        <Link to="/collections/high-jewelry" className="mobile-link" onClick={closeAllMenus}>Haute Joaillerie</Link>
                        <Link to="/collections/bridal" className="mobile-link" onClick={closeAllMenus}>Bridal Collection</Link>
                        <Link to="/collections/bespoke" className="mobile-link" onClick={closeAllMenus}>Bespoke Pieces</Link>
                      </div>
                    )}
                  </div>
                  
                  <div className="mobile-featured">
                    <Link to="/new-arrivals" className="mobile-featured-link" onClick={closeAllMenus}>
                      Discover Latest Pieces
                      <span className="mobile-new-badge">New</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/store" className="mobile-menu-link" onClick={closeAllMenus}>Store</Link>
            <Link to="/about" className="mobile-menu-link" onClick={closeAllMenus}>About</Link>
            
            {user?.user_role === 'VIP' && (
              <Link to="/vip" className="mobile-menu-link mobile-vip-link" onClick={closeAllMenus}>
                <Crown className="mobile-vip-icon" />
                VIP Access
              </Link>
            )}
          </div>
          
          <div className="mobile-menu-footer">
            {user ? (
              <div className="mobile-account-section">
                <div className="mobile-user-info">
                  <User className="mobile-user-icon" />
                  <div className="mobile-user-details">
                    <span className="mobile-user-name">{user.name}</span>
                    <span className="mobile-user-email">{user.email}</span>
                  </div>
                </div>
                
                <div className="mobile-account-links">
                  {user.user_role === 'Customer' && (
                    <>
                      <Link to="/account/dashboard" className="mobile-account-link" onClick={closeAllMenus}>Dashboard</Link>
                      <Link to="/account/orders" className="mobile-account-link" onClick={closeAllMenus}>Orders</Link>
                      <Link to="/account/appointments" className="mobile-account-link" onClick={closeAllMenus}>Appointments</Link>
                      <Link to="/account/wishlist" className="mobile-account-link" onClick={closeAllMenus}>Saved Items</Link>
                      <Link to="/account/profile" className="mobile-account-link" onClick={closeAllMenus}>Profile Settings</Link>
                    </>
                  )}
                  {user.user_role === 'Seller' && (
                    <Link to="/seller" className="mobile-account-link" onClick={closeAllMenus}>Seller Dashboard</Link>
                  )}
                </div>
                
                <Logout onLogout={handleLogout} className="mobile-logout-button" />
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="mobile-auth-button" onClick={closeAllMenus}>Login</Link>
                <Link to="/register" className="mobile-auth-button mobile-register-button" onClick={closeAllMenus}>Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;