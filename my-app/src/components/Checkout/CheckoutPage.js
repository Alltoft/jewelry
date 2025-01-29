import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthContext } from '../../context/AuthContext'; // Corrected import path
import { getCart } from '../../api'; // Corrected import path
import { ArrowLeft } from 'lucide-react';
import CheckoutSteps from './CheckoutSteps';
import CheckoutForm from './CheckoutForm/indexCheckout';
import OrderSummary from './OrderSummary';
import SecurityFeatures from './SecurityFeatures';
import './CheckoutPage.css';

const stripePromise = loadStripe('pk_test_51QS0cNF4QAlgSVdgf3N7cibjgafxZF3pwDCSh9McWqs3wmzvdIUVoVv6oh4UkB7ejqCkp6KbQo2zf8yM9meSz7V000HVLIJvRo');

const CheckoutPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { amount } = location.state || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [totalAmount, setTotalAmount] = useState(amount);

  const loadCart = async () => {
    let cartData = [];
    if (user && user.user_role === 'Customer') {
      try {
        const Cart = await getCart();
        cartData = Cart.data;
        console.log('cart: ', cartData);
      } catch (error) {
        console.error(error);
      }
    } else {
      cartData = JSON.parse(localStorage.getItem('cart')) || [];
    }
    setCart(cartData);
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  useEffect(() => {
    const storedRate = localStorage.getItem('selectedRate');
    if (storedRate && storedRate !== '[]') {
      setSelectedRate(JSON.parse(storedRate));
    }
  }, []);

  useEffect(() => {
    const handleShippingUpdate = (e) => {
      const rate = e.detail;
      setSelectedRate(rate);
    };

    window.addEventListener('shippingRateUpdate', handleShippingUpdate);
    return () => window.removeEventListener('shippingRateUpdate', handleShippingUpdate);
  }, []);

  const handleTotalChange = (newTotal) => {
    setTotalAmount(newTotal);
  };

  console.log('selectedRate: ', selectedRate);
  // Check both amount and cart
  const validateCheckout = () => {
    // Skip validation on confirmation step
    if (currentStep === 3) return null;

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
        {!user && (
          <div className="auth-warning">
            <p>You cannot track your order if you are not logged in. Please log in or register to track your order.</p>
          </div>
        )}
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
              amount={totalAmount}  // Changed from amount to totalAmount
              currentStep={currentStep}
              setStep={setCurrentStep}
              selectedRate={selectedRate}
              setSelectedRate={setSelectedRate}
            />
          </Elements>
        </div>

        <div className="checkout-sidebar">
          <OrderSummary 
            amount={amount} 
            selectedRate={selectedRate}
            onTotalChange={handleTotalChange} 
          />
          <SecurityFeatures />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;