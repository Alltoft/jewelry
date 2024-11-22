// jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  const loadCart = async () => {
    try {
      const res = await axios.get('/cart');
      setCartItems(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const checkout = async () => {
    try {
      await axios.post('/cart/checkout');
      // Notify user and redirect
    } catch (err) {
      console.error(err.response.data);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div>
      <h2>Your Cart</h2>
      {/* List cart items with options to update quantity or remove */}
      <button onClick={checkout}>Checkout</button>
    </div>
  );
};

export default CartPage;