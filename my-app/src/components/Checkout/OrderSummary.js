import { React, useEffect, useState }from 'react';
import { Package } from 'lucide-react';

const OrderSummary = ({ amount, selectedRate, onTotalChange }) => {
  const shippingCost = selectedRate ? selectedRate.amount : 0;
  const total = parseFloat(amount) + shippingCost;

  useEffect(() => {
    onTotalChange(total);
  }, [total, onTotalChange]);

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
            {selectedRate ? selectedRate.serviceType : 'Shipping'}
          </span>
          <span>
            {selectedRate ? `$${shippingCost.toFixed(2)}` : 'Not selected'}
          </span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <div className="order-note">
        <p>Each piece is carefully packaged in our signature jewelry box</p>
      </div>
    </div>
  );
};

export default OrderSummary;