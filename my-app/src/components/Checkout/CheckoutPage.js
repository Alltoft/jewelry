import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft } from 'lucide-react';
import CheckoutSteps from './CheckoutSteps';
import CheckoutForm from './CheckoutForm/indexCheckout';
import OrderSummary from './OrderSummary';
import SecurityFeatures from './SecurityFeatures';
import './CheckoutPage.css';

const stripePromise = loadStripe('pk_test_51QS0cNF4QAlgSVdgf3N7cibjgafxZF3pwDCSh9McWqs3wmzvdIUVoVv6oh4UkB7ejqCkp6KbQo2zf8yM9meSz7V000HVLIJvRo');

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount } = location.state || {};
  const [currentStep, setCurrentStep] = useState(1);

  // Check both amount and cart
  const validateCheckout = () => {
    // Skip validation on confirmation step
    if (currentStep === 3) return null;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!amount || !cart.length) {
      return (
        <div className="checkout-error">
          <h2>Your Cart is Empty</h2>
          <p>Please add items to your cart before proceeding to checkout.</p>
          <button onClick={() => navigate('/cart')} className="return-to-cart">
            Return to Cart
          </button>
        </div>
      );
    }
    return null;
  };

  const errorContent = validateCheckout();
  if (errorContent) return errorContent;

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          Return to Shopping Cart
        </button>
        <h1>Complete Your Purchase</h1>
        <p>Secure checkout process for your fine jewelry selection</p>
      </div>

      <div className="checkout-container">
        <div className="checkout-main">
          <CheckoutSteps currentStep={currentStep} />
          
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              amount={amount} 
              currentStep={currentStep}
              setStep={setCurrentStep}
            />
          </Elements>
        </div>

        <div className="checkout-sidebar">
          <OrderSummary amount={amount} />
          <SecurityFeatures />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;