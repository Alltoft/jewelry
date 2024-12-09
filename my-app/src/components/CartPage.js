// CartPage.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';
import './CartPage.css';

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [detailedCartItems, setDetailedCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load Cart Items
  const loadCart = async () => {
    setLoading(true);
    if (user && user.role === 'Customer') {
      try {
        const res = await axios.get('/cart');
        setCartItems(res.data);
        console.log('Authenticated Cart Items:', res.data); // Debugging
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      setCartItems(guestCart);
      console.log('Guest Cart Items:', guestCart); // Debugging
    }
    setLoading(false);
  };

  // Fetch Product Details for Guest Users
  const fetchProductDetails = async (items) => {
    try {
      const productRequests = items.map(item =>
        axios.get(`/product/${item.product_id}`)
      );
      const productResponses = await Promise.all(productRequests);
      const detailedItems = items.map((item, index) => ({
        ...item,
        ...productResponses[index].data, // Merge product details
      }));
      setDetailedCartItems(detailedItems);
    } catch (err) {
      console.error('Error fetching product details:', err.response?.data || err.message);
    }
  };

  // Update Quantity
  const updateQuantity = (productId, quantity) => {
    const updatedCart = cartItems.map(item =>
      item.product_id === productId ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    if (user && user.role === 'Customer') {
      axios.post('/cart/update', { product_id: productId, quantity })
        .catch(err => console.error(err.response?.data || err.message));
    } else {
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
    }

    // Update detailedCartItems for Guest Users
    if (!user || user.role !== 'Customer') {
      const updatedDetailed = detailedCartItems.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      );
      setDetailedCartItems(updatedDetailed);
    }
  };

  // Remove Item
  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.product_id !== productId);
    setCartItems(updatedCart);
    if (user && user.role === 'Customer') {
      axios.post('/cart/remove', { product_id: productId })
        .catch(err => console.error(err.response?.data || err.message));
    } else {
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
    }

    // Remove from detailedCartItems for Guest Users
    if (!user || user.role !== 'Customer') {
      const updatedDetailed = detailedCartItems.filter(item => item.product_id !== productId);
      setDetailedCartItems(updatedDetailed);
    }
  };

  // Calculate Total
  const calculateTotal = () => {
    const itemsToCalculate = user && user.role === 'Customer' ? cartItems : detailedCartItems;
    return itemsToCalculate.reduce((total, item) => {
      const itemPrice = parseFloat(item.product_price) || parseFloat(item.price) || 0;
      return total + itemPrice * item.quantity;
    }, 0).toFixed(2);
  };

  // Checkout
  const checkout = () => {
    const totalAmount = calculateTotal();
    navigate('/payments', { state: { amount: totalAmount } });
  };

  // Initial Load
  useEffect(() => {
    loadCart();
  }, [user]);

  // Fetch Product Details for Guest Users Whenever Cart Items Change
  useEffect(() => {
    if ((!user || user.role !== 'Customer') && cartItems.length > 0) {
      fetchProductDetails(cartItems);
    } else {
      setDetailedCartItems([]);
    }
  }, [cartItems, user]);

  if (loading || (!user || user.role !== 'Customer') && detailedCartItems.length !== cartItems.length) {
    return <Loading />; // Ensure you have a Loading component
  }

  const renderCartItems = () => {
    if (user && user.role === 'Customer') {
      // Authenticated Users: Use cartItems directly
      return cartItems.map(item => (
        <div key={item.product_id} className="cart-item">
          <img
            src={`/static/images/product_pics/${item.product_image || 'default.jpg'}`}
            alt={item.product_name || 'Product'}
            onError={(e) => { e.target.src = '/static/images/product_pics/default.jpg'; }}
          />
          <div className="item-details">
            <h3>{item.product_name || 'Unnamed Product'}</h3>
            <p>Price: ${item.product_price || '0.00'}</p>
            <div className="quantity-update">
              <label htmlFor={`quantity-${item.product_id}`}>Quantity:</label>
              <input
                type="number"
                id={`quantity-${item.product_id}`}
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
              />
            </div>
            <button onClick={() => removeItem(item.product_id)} className="remove-button">
              Remove
            </button>
          </div>
        </div>
      ));
    } else {
      // Guest Users: Use detailedCartItems
      return detailedCartItems.map(item => (
        <div key={item.product_id} className="cart-item">
          <img
            src={`/static/images/product_pics/${item.product_image || 'default.jpg'}`}
            alt={item.product_name || 'Product'}
            onError={(e) => { e.target.src = '/static/images/product_pics/default.jpg'; }}
          />
          <div className="item-details">
            <h3>{item.product_name || 'Unnamed Product'}</h3>
            <p>Price: ${item.product_price || '0.00'}</p>
            <div className="quantity-update">
              <label htmlFor={`quantity-${item.product_id}`}>Quantity:</label>
              <input
                type="number"
                id={`quantity-${item.product_id}`}
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
              />
            </div>
            <button onClick={() => removeItem(item.product_id)} className="remove-button">
              Remove
            </button>
          </div>
        </div>
      ));
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {(user && user.role === 'Customer' && cartItems.length === 0) ||
      ((!user || user.role !== 'Customer') && detailedCartItems.length === 0) ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {renderCartItems()}
          <div className="cart-summary">
            <h3>Total: ${calculateTotal()}</h3>
            <button onClick={checkout} className="checkout-button">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
