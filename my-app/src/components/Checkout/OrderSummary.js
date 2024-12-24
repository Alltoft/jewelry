import React from 'react';
import { Package } from 'lucide-react';

const OrderSummary = ({ amount }) => {
  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <div className="summary-details">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${parseFloat(amount).toFixed(2)}</span>
        </div>
        <div className="summary-row shipping">
          <span>
            <Package size={16} />
            Premium Shipping
          </span>
          <span>Complimentary</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${parseFloat(amount).toFixed(2)}</span>
        </div>
      </div>
      <div className="order-note">
        <p>Each piece is carefully packaged in our signature jewelry box</p>
      </div>
    </div>
  );
};

export default OrderSummary;