// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file for styling
import { logoutUser } from '../api'; // Import the logout API function

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInState = localStorage.getItem('loggedIn');
    const role = localStorage.getItem('userRole');
    if (loggedInState === 'true') {
      setLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLoginLogout = async () => {
    if (loggedIn) {
      try {
        await logoutUser(); // Call the logout endpoint
        localStorage.removeItem('loggedIn'); // Remove login state from local storage
        localStorage.removeItem('userRole'); // Remove user role from local storage
        setLoggedIn(false);
        setUserRole('');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Luxurious Jewelry</h1>
        <p>Discover the finest jewelry crafted with precision and elegance.</p>
      </header>
      <div className="home-buttons">
        <button className="home-button" onClick={handleLoginLogout}>
          {loggedIn ? 'Logout' : 'Login'}
        </button>
        {!loggedIn && (
          <Link to="/register">
            <button className="home-button">Register</button>
          </Link>
        )}
        <Link to="/store">
          <button className="home-button">Store</button>
        </Link>
        <Link to="/aboutus">
          <button className="home-button">About Us</button>
        </Link>
        {loggedIn && (
          <Link to={userRole === 'Seller' ? '/seller' : '/costumer'}>
            <button className="home-button">Dashboard</button>
          </Link>
        )}
        <Link to="/search">
          <button className="home-button">Search</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;