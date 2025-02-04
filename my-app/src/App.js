// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { motion } from 'framer-motion';
import ScrollToTop from './components/ScrollToTop';

import Home from './components/Home';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SellerDashboard from './components/SellerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import ProductDetailsPage from './components/ProductDetailsPage';
import CartPage from './components/CartPage';
import WishlistPage from './components/wishlistpage/wishindex';
import OrdersPage from './components/OrdersPage';
import OrderPage from './components/OrderPage';
import Logout from './components/Logout';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import CollectionsPage from './components/CollectionsPage';
import FAQPage from './components/FAQPage';
import TermsAndConditionsPage from './components/TermsAndConditionsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import NavLinks from './components/NavLinks';
import CheckoutPage from './components/Checkout/CheckoutPage';
import Footer from './components/Footer';
import Store from './components/Store';
import './App.css';
import TestAddress from './pages/TestAddress';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <header>
            <NavLinks />
          </header>
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Home />
                  </motion.div>
                }
              />
              <Route
                path="/login"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoginPage />
                  </motion.div>
                }
              />
              <Route
                path="/register"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <RegisterPage />
                  </motion.div>
                }
              />
              <Route
                path="/logout"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Logout />
                  </motion.div>
                }
              />
              <Route
                path="/seller/*"
                element={
                  <PrivateRoute role="Seller">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <SellerDashboard />
                    </motion.div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/*"
                element={
                  <PrivateRoute role="Customer">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <CustomerDashboard />
                    </motion.div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductDetailsPage />
                  </motion.div>
                }
              />
              <Route
                path="/cart"
                element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <CartPage />
                    </motion.div>
                }
              />
              <Route
                path="/wishlist"
                element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <WishlistPage />
                    </motion.div>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute role="Customer">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <OrdersPage />
                    </motion.div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/order"
                element={
                  <PrivateRoute role="Customer">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <OrderPage />
                    </motion.div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <SellerDashboard />
                    </motion.div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AboutPage />
                  </motion.div>
                }
              />
              <Route
                path="/contact"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ContactPage />
                  </motion.div>
                }
              />
              <Route
                path="/collections"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CollectionsPage />
                  </motion.div>
                }
              />
              <Route
                path="/faq"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <FAQPage />
                  </motion.div>
                }
              />
              <Route
                path="/terms"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TermsAndConditionsPage />
                  </motion.div>
                }
              />
              <Route
                path="/privacy"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PrivacyPolicyPage />
                  </motion.div>
                }
              />
              <Route
                path="/checkout"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckoutPage />
                  </motion.div>
                }
              />
              <Route
                path="/store"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Store />
                  </motion.div>
                }
              />
              <Route
                path="/test-address"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TestAddress />
                  </motion.div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;