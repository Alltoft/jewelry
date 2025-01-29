import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Package, MapPin, Phone, Mail, Printer, Clock, Shield, Gift, AlertCircle, Map, ArrowLeft } from 'lucide-react';
import './OrderPage.css';

const OrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState({
    id: "ORD-2024-001",
    status: "Processing",
    date: "2024-03-15",
    estimatedDelivery: "2024-03-20",
    trackingNumber: "1Z999AA1234567890",
    customer: {
      name: "Emma Thompson",
      email: "emma.t@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Luxury Lane, Beverly Hills, CA 90210"
    },
    payment: {
      method: "Visa",
      last4: "4242",
      amount: 2850.00
    },
    items: [
      {
        id: 1,
        name: "Diamond Solitaire Ring",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
        price: 2500.00,
        quantity: 1,
        details: "18K White Gold, 1.5ct Diamond"
      }
    ],
    shipping: {
      method: "FedEx Priority",
      cost: 0,
      tracking: {
        status: "In Transit",
        location: "Los Angeles, CA",
        updates: [
          { time: "2024-03-15 09:00", status: "Order Confirmed" },
          { time: "2024-03-15 14:30", status: "Processing" },
          { time: "2024-03-16 10:15", status: "Shipped" }
        ]
      }
    }
  });

  const getStatusColor = (status) => {
    const statusColors = {
      'Processing': 'status-processing',
      'Shipped': 'status-shipped',
      'Delivered': 'status-delivered',
      'In Transit': 'status-transit'
    };
    return statusColors[status] || 'status-default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-page">
      <div className="order-header">
        <button onClick={() => window.history.back()} className="back-button">
          <ArrowLeft size={20} />
          Back to Orders
        </button>
        <h1>Order Details</h1>
        <p className="order-subtitle">Order #{order.id}</p>
      </div>

      <div className="order-container">
        <div className="order-main">
          <div className="order-status-card">
            <div className="status-header">
              <h2>Order Status</h2>
              <span className={`status-badge ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="tracking-timeline">
              {order.shipping.tracking.updates.map((update, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-icon">
                    <Clock size={16} />
                  </div>
                  <div className="timeline-content">
                    <p className="timeline-status">{update.status}</p>
                    <p className="timeline-time">{formatTime(update.time)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="tracking-map">
              <Map size={24} />
              <p>Current Location: {order.shipping.tracking.location}</p>
            </div>
          </div>

          <div className="order-items-card">
            <h2>Items Ordered</h2>
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-specs">{item.details}</p>
                  <div className="item-meta">
                    <span className="quantity">Qty: {item.quantity}</span>
                    <span className="price">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-sidebar">
          <div className="info-card delivery-info">
            <h2>Delivery Information</h2>
            <div className="info-group">
              <MapPin size={18} />
              <div>
                <h3>Shipping Address</h3>
                <p>{order.customer.address}</p>
              </div>
            </div>
            <div className="info-group">
              <Package size={18} />
              <div>
                <h3>Shipping Method</h3>
                <p>{order.shipping.method}</p>
                <p className="delivery-estimate">
                  Estimated Delivery: {formatDate(order.estimatedDelivery)}
                </p>
              </div>
            </div>
          </div>

          <div className="info-card customer-info">
            <h2>Customer Information</h2>
            <div className="info-group">
              <Mail size={18} />
              <div>
                <h3>Email</h3>
                <p>{order.customer.email}</p>
              </div>
            </div>
            <div className="info-group">
              <Phone size={18} />
              <div>
                <h3>Phone</h3>
                <p>{order.customer.phone}</p>
              </div>
            </div>
          </div>

          <div className="info-card payment-info">
            <h2>Payment Information</h2>
            <div className="payment-details">
              <div className="payment-method">
                <span>Payment Method</span>
                <p>{order.payment.method} ending in {order.payment.last4}</p>
              </div>
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${order.payment.amount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{order.shipping.cost === 0 ? 'Free' : `$${order.shipping.cost.toFixed(2)}`}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${order.payment.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="print-button">
              <Printer size={18} />
              Print Order Details
            </button>
            <button className="track-button">
              <Package size={18} />
              Track Package
            </button>
          </div>

          <div className="support-section">
            <div className="support-card">
              <AlertCircle size={18} />
              <div>
                <h3>Need Help?</h3>
                <p>Our customer service team is available 24/7</p>
                <a href="/contact" className="support-link">Contact Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;