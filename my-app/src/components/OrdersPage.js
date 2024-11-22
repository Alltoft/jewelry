// jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await axios.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {/* List orders with details */}
    </div>
  );
};

export default OrdersPage;