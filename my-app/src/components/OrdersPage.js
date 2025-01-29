import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Calendar, Filter, ArrowUpDown } from 'lucide-react';
import { getOrders } from '../api';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        if (response && response.data) {
          console.log('resposne.data:', response.data);
          setOrders(response.data);
        } else {
          console.log('Invalid response:');
          setError('Failed to fetch orders: Invalid response');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
        setError('Failed to fetch orders: ' + errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const sortOrders = (ordersToSort) => {
    return ordersToSort.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      }
      return sortOrder === 'desc'
        ? b.payment.amount - a.payment.amount
        : a.payment.amount - b.payment.amount;
    });
  };

  const filterOrders = (ordersToFilter) => {
    return ordersToFilter.filter(order => {
      const statusMatch = filterStatus === 'all' || order.status === filterStatus;
      const dateMatch = !dateRange.start || !dateRange.end || 
        (new Date(order.date) >= new Date(dateRange.start) &&
         new Date(order.date) <= new Date(dateRange.end));
      return statusMatch && dateMatch;
    });
  };

  const handleSort = () => {
    if (sortBy === 'date') {
      setSortBy('amount');
    } else {
      setSortBy('date');
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const filteredAndSortedOrders = sortOrders(filterOrders(orders));

  console.log('filtered: ', filteredAndSortedOrders);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <div className="orders-actions">
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="Search orders..." />
          </div>
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <button onClick={handleSort} className="sort-btn">
            <ArrowUpDown size={20} />
            Sort by {sortBy === 'date' ? 'Amount' : 'Date'}
          </button>
        </div>
      </div>

      {filteredAndSortedOrders.length === 0 ? (
        <div className="empty-orders">
          <Package size={48} />
          <h2>No Orders Yet</h2>
          <p>When you place orders, they will appear here</p>
          <Link to="/store" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredAndSortedOrders.map((order) => (
            <Link to={`/order/${order.order_id}`} key={order.order_id} className="order-card">
              <div className="order-card-header">
                <span className={`status-badge status-${order.order_status ? order.order_status.toLowerCase() : 'Unknown'}`}>
                  {order.order_status ? order.order_status.toLowerCase() : 'Unknown'}
                </span>
                <span className="order-date">
                  <Calendar size={16} />
                  {formatDate(order.order_date)}
                </span>
              </div>
              
              {/* <div className="order-items-preview">
                {order.items.map((item) => (
                  <div key={item.id} className="preview-item">
                    <img src={item.image} alt={item.name} />
                    <div className="preview-item-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div> */}

              <div className="order-card-footer">
                <div className="order-info">
                  <span>Order #{order.order_id}</span>
                  <span className="order-total">${order.total_price !== null ? order.total_price.toFixed(2) : 'N/A'}</span>
                </div>
                <div className="delivery-info">
                  <span>Estimated Delivery:</span>
                  {/* <span>{formatDate(order.estimatedDelivery)}</span> */}
                  <span>maybe tomorrow</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;