import React from 'react';
import { Check, Package, Banknote, CreditCard } from 'lucide-react';

const ConfirmationStep = ({ paymentMethod = 'card' }) => {
  // Get payment method from local storage, defaults to card if not found
  const storedPaymentMethod = localStorage.getItem('paymentMethod') || paymentMethod;
  
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
        
        {storedPaymentMethod === 'cod' ? (
          <div className="detail-item">
            <Banknote size={20} />
            <div>
              <h4>Cash on Delivery</h4>
              <p>Payment will be collected upon delivery of your jewelry.</p>
            </div>
          </div>
        ) : (
          <div className="detail-item">
            <CreditCard size={20} />
            <div>
              <h4>Payment Received</h4>
              <p>Your payment has been successfully processed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationStep;