import React, { useEffect, useState } from 'react';
import { Check, Package, Banknote, PhoneCall, FileText, Award, Clock, Mail } from 'lucide-react';

const ConfirmationStep = () => {
  const [orderId, setOrderId] = useState(null);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    // Get order ID from localStorage if available
    const storedOrderId = localStorage.getItem('lastOrderId');
    if (storedOrderId) {
      setOrderId(storedOrderId);
    }
    
    // Start animations after component mounts
    setTimeout(() => {
      setAnimation(true);
    }, 100);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className={`confirmation-step ${animation ? 'animate' : ''}`}>
      <div className="confirmation-header">
        <div className="success-animation">
          <div className="checkmark-circle">
            <Check size={32} />
          </div>
        </div>
        <div className="luxury-badge">
          <Award size={14} />
          <span>Premium Experience</span>
        </div>
        <h2>Thank You for Choosing Us</h2>
        <p className="confirmation-subtitle">Your exquisite jewelry awaits you</p>
      </div>
      
      {orderId && (
        <div className="order-id-container">
          <div className="order-id-icon">
            <FileText size={18} />
          </div>
          <div className="order-id-text">
            <span>Order Reference</span>
            <p><strong>{orderId}</strong></p>
          </div>
        </div>
      )}
      
      <div className="order-timeline">
        <div className="timeline-step completed">
          <div className="timeline-icon">
            <Check size={16} />
          </div>
          <div className="timeline-content">
            <h4>Order Placed</h4>
            <p>Your order has been successfully received</p>
            <span className="timeline-date">{new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </div>
        
        <div className="timeline-step">
          <div className="timeline-icon">
            <Mail size={16} />
          </div>
          <div className="timeline-content">
            <h4>Confirmation Email</h4>
            <p>A confirmation email has been sent to your inbox</p>
          </div>
        </div>
        
        <div className="timeline-step">
          <div className="timeline-icon">
            <Clock size={16} />
          </div>
          <div className="timeline-content">
            <h4>Preparing Your Order</h4>
            <p>Our team is preparing your luxury jewelry</p>
          </div>
        </div>
      </div>
      
      <div className="confirmation-details">
        <h3>What Happens Next</h3>
        <div className="detail-item">
          <div className="detail-icon">
            <Package size={18} />
          </div>
          <div>
            <h4>Premium Packaging</h4>
            <p>Your jewelry will be presented in our signature luxury box, perfect for gifting or keeping as a treasured item.</p>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-icon">
            <Banknote size={18} />
          </div>
          <div>
            <h4>Cash on Delivery</h4>
            <p>Inspect your exquisite jewelry upon delivery before making your payment. We accept cash or card payments.</p>
          </div>
        </div>
        
        <div className="detail-item">
          <div className="detail-icon">
            <PhoneCall size={18} />
          </div>
          <div>
            <h4>Personal Contact</h4>
            <p>Our dedicated jewelry consultant will contact you shortly to arrange a convenient delivery time.</p>
          </div>
        </div>
      </div>
      
      <div className="additional-info">
        <div className="info-divider">
          <span>Thank You</span>
        </div>
        <p>We appreciate your trust in our craftsmanship and look forward to delivering your beautiful jewelry.</p>
        {!orderId && (
          <p className="order-note">Please save this confirmation for your reference as you won't be able to track this order without an account.</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmationStep;
