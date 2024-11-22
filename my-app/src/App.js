// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SellerDashboard from './components/SellerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import ProductDetails from './components/ProductDetails';
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import OrdersPage from './components/OrdersPage';
import Logout from './components/Logout';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<Logout />} />

          <Route
            path="/seller/*"
            element={<PrivateRoute role="Seller"><SellerDashboard /></PrivateRoute>}
          />
          <Route
            path="/customer/*"
            element={<PrivateRoute role="Customer"><CustomerDashboard /></PrivateRoute>}
          />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route
            path="/cart"
            element={<PrivateRoute role="Customer"><CartPage /></PrivateRoute>}
          />
          <Route
            path="/wishlist"
            element={<PrivateRoute role="Customer"><WishlistPage /></PrivateRoute>}
          />
          <Route
            path="/orders"
            element={<PrivateRoute role="Customer"><OrdersPage /></PrivateRoute>}
          />
          {/* Add other routes as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;