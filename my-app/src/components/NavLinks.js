// my-app/src/components/NavLinks.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logout from './Logout';

const NavLinks = () => {
  const { user } = useContext(AuthContext);

  const handleLogout = () => {
    window.location.reload();
  };

  return (
    <>
      <li><Link to="/terms">Terms</Link></li>
      <li><Link to="/privacy">Privacy Policy</Link></li>
      {(!user || user.user_role !== 'Seller') && (
        <>
          <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/wishlist">Wishlist</Link></li>
          <li><Link to="/orders">Orders</Link></li>
        </>
      )}
      {user && user.user_role === 'Seller' && (
        <li><Link to="/seller">Seller Dashboard</Link></li>
      )}
      {user && user.user_role === 'Customer' && (
        <li><Link to="/customer">Customer Dashboard</Link></li>
      )}
      {!user && (
        <>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
        </>
      )}
      {user && (
        <li>
          <Logout onLogout={handleLogout} className="nav-button" />
        </li>
      )}
    </>
  );
};

export default NavLinks;