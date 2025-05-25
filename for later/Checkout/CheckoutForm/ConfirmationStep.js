import React from 'react';
import { Check, Package } from 'lucide-react';

const ConfirmationStep = () => {
  return (
    <div className="confirmation-step">
      <div className="success-animation">
        <div className="checkmark-circle">
          <Check size={48} />
        </div>
      </div>
      <h2>Thank You for Your Order!</h2>
      <p>Your order has been successfully placed.</p>
      <div className="confirmation-details">
        <div className="detail-item">
          <Package size={20} />
          <div>
            <h4>Order Confirmation</h4>
            <p>You will receive an email with your order details shortly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;