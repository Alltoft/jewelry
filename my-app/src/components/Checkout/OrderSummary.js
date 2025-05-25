import React, { useEffect } from 'react';
import { Package, Gem, Star, Shield } from 'lucide-react';
import './OrderSummary.css';

const OrderSummary = ({ amount, onTotalChange }) => {
  const total = parseFloat(amount);

  useEffect(() => {
    onTotalChange(total);
  }, [total, onTotalChange]);

  return (
    <div className="order-summary">
      <h2>Your Selection</h2>
      
      <div className="premium-badge">
        <span>Premium Experience</span>
      </div>
      
      <div className="summary-details">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${parseFloat(amount).toFixed(2)}</span>
        </div>
        <div className="summary-row shipping">
          <span>
            <Package size={16} />
            Shipping
          </span>
          <span>Arranged separately</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="order-note">
        <div className="luxury-packaging">
          <Gem size={18} />
          <p>Each piece is delicately packaged in our signature jewelry box</p>
        </div>
        <p className="shipping-note">
          After your order is confirmed, our team will contact you to arrange
          shipping and delivery.
        </p>
      </div>
      
      <div className="order-benefits">
        <div className="benefit">
          <Star size={14} />
          <span>Exclusive Design</span>
        </div>
        <div className="benefit">
          <Shield size={14} />
          <span>Secure Transaction</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;