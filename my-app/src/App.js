// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Products from './components/Products';
import SellerDashboard from './components/SellerDashboard';
import CostumerDashboard from './components/CostumerDashboard';
import Home from './components/Home';
import Store from './components/Store';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/costumer" element={<CostumerDashboard />} />
          <Route path="/store" element={<Store />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;