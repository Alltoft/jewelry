import React, { useState, useContext } from 'react';
import { SoldProduct, clearCart } from '../../../api';
import { AuthContext } from '../../../context/AuthContext';
import { AlertCircle, ArrowLeft, Package, Clock, ShieldCheck } from 'lucide-react';
import './PaymentForm.css';

const PaymentForm = ({ onSubmit, amount, shippingDetails, setStep }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  
  // Simplified payload with just the essential customer information
  const payload = {
    customer_details: {
      name: shippingDetails.firstName + " " + shippingDetails.lastName,
      email: shippingDetails.email,
      phone: shippingDetails.phone,
      address: shippingDetails.address,
      city: shippingDetails.city,
      state: shippingDetails.state,
      zipCode: shippingDetails.zipCode
    },
    amount: amount,
    payment_method: 'cod',
    payment_status: 'pending'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let orderCreated = false;
      
      // Create order with COD payment method for all users (logged in or guests)
      const response = await SoldProduct({
        payment_method: 'cod',
        payment_status: 'pending',
        customer_details: payload.customer_details,
        amount: amount
      });
      
      // For non-logged in users, also store order info locally for reference
      if (!user) {
        localStorage.setItem('pendingOrder', JSON.stringify({
          customer_details: payload.customer_details,
          amount: payload.amount,
          payment_method: 'cod',
          payment_status: 'pending',
          date: new Date().toISOString()
        }));
      }
      
      // Verify the order was actually created
      if (response && response.data && response.data.status === 'success') {
        orderCreated = true;
        console.log('Order created successfully:', response.data.order_id);
        
        // Store order ID for reference
        localStorage.setItem('lastOrderId', response.data.order_id);
        
        // Clear cart only if order creation was successful
        try {
          if (user) {
            await clearCart();
          }
        } catch (cartErr) {
          console.error('Failed to clear cart:', cartErr);
          // Continue with checkout even if cart clearing fails
        }
      } else {
        throw new Error('Server returned an invalid response');
      }
      
      // Only proceed if order was created successfully
      if (orderCreated) {
        // Clean up cart data
        localStorage.removeItem('cart');
        
        // Move to confirmation step
        onSubmit('cod');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred while processing your order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setStep(1)} 
        className="back-to-shipping"
      >
        <ArrowLeft size={20} />
        Back to Shipping
      </button>

      <div className="payment-info">
        <h2>Cash on Delivery</h2>
        <p className="payment-description">
          You'll pay for your order when it's delivered to your address. No advance payment is required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="luxury-payment-badge">
          <div className="luxury-badge-icon">
            <div className="gold-circle"></div>
          </div>
          <span>Premium Experience</span>
        </div>
        
        <div className="cod-info">
          <div className="cod-benefits">
            <div className="cod-benefit">
              <div className="benefit-icon">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4>Safe & Secure</h4>
                <p>Inspect your exquisite jewelry before payment</p>
              </div>
            </div>
            <div className="cod-benefit">
              <div className="benefit-icon">
                <Package size={22} />
              </div>
              <div>
                <h4>Premium Packaging</h4>
                <p>Delivered in our signature luxury jewelry box</p>
              </div>
            </div>
            <div className="cod-benefit">
              <div className="benefit-icon">
                <Clock size={22} />
              </div>
              <div>
                <h4>Personalized Service</h4>
                <p>Pay with cash or card when you receive your jewelry</p>
              </div>
            </div>
          </div>
          
          <div className="cod-terms">
            <p>By placing this order, you agree to pay the full amount upon delivery. Our luxury jewelry consultant will contact you to arrange a convenient delivery time.</p>
          </div>
          
          <div className="cod-note">
            <p><strong>Note:</strong> Shipping is arranged separately. Our team will contact you to coordinate the most suitable delivery or pickup option for your precious purchase.</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <button 
          type="submit" 
          className="pay-btn"
          disabled={loading}
        >
          {loading ? (
            <span className="loading-text">Processing order...</span>
          ) : (
            <>Place Order (Pay on Delivery ${parseFloat(amount).toFixed(2)})</>
          )}
        </button>
      </form>
    </>
  );
};

export default PaymentForm;
