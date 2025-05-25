import React, { useEffect, useState } from 'react';
import { Check, Package, Banknote, PhoneCall, FileText } from 'lucide-react';

const ConfirmationStep = () => {
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Get order ID from localStorage if available
    const storedOrderId = localStorage.getItem('lastOrderId');
    if (storedOrderId) {
      setOrderId(storedOrderId);
    }
  }, []);

  return (
    <div className="confirmation-step">
      <div className="success-animation">
        <div className="checkmark-circle">
          <Check size={48} />
        </div>
      </div>
      <h2>Thank You for Your Order!</h2>
      <p>Your order has been successfully placed.</p>
      
      {orderId && (
        <div className="order-id-container">
          <FileText size={18} />
          <p>Order ID: <strong>{orderId}</strong></p>
        </div>
      )}
      
      <div className="confirmation-details">
        <div className="detail-item">
          <Package size={20} />
          <div>
            <h4>Order Confirmation</h4>
            <p>You will receive an email with your order details shortly.</p>
          </div>
        </div>
        
        <div className="detail-item">
          <Banknote size={20} />
          <div>
            <h4>Cash on Delivery</h4>
            <p>Payment will be collected upon delivery of your jewelry.</p>
          </div>
        </div>
        
        <div className="detail-item">
          <PhoneCall size={20} />
          <div>
            <h4>Shipping Arrangement</h4>
            <p>Our team will contact you soon to arrange pickup or delivery.</p>
          </div>
        </div>
      </div>
      
      <div className="additional-info">
        <p>For any questions about your order, please contact our customer service team.</p>
        {!orderId && (
          <p className="order-note">Please save this page for your reference as you won't be able to track this order without an account.</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmationStep;
