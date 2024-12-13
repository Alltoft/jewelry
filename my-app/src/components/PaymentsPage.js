// src/components/PaymentsPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentsPage.css';

const stripePromise = loadStripe('pk_test_51QS0cNF4QAlgSVdgf3N7cibjgafxZF3pwDCSh9McWqs3wmzvdIUVoVv6oh4UkB7ejqCkp6KbQo2zf8yM9meSz7V000HVLIJvRo'); // Replace with your Stripe publishable key

async function fetchPaymentMethod(paymentMethodId) {
  try {
    const response = await fetch(`/retrieve-payment-method/${paymentMethodId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const paymentMethod = await response.json();
    console.log('Payment Method Card Details:', paymentMethod.card);
  } catch (error) {
    console.error('Error fetching payment method:', error);
  }
}

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('/create-payment', {
        amount,
        customer_details: {
          name,
          email,
          phone,
        }
      });

      const clientSecret = response.data.client_secret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
            email,
            phone,
          },
        },
      });
      const paymentMethodId = result.paymentIntent.payment_method;
      fetchPaymentMethod(paymentMethodId);

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setSuccess(true);
          axios.post('/sold');
          localStorage.removeItem('guestCart');
          setTimeout(() => {
            if (localStorage.getItem('guestWishlist')) {
              navigate('/wishlist');
            } else {
              navigate('/');
            }
          }, 3000);
        } else {
          setError('Payment failed. Please try again.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-message">
        <div className="checkmark-container">
          <div className="checkmark"></div>
        </div>
        <h2>Thank you for your purchase!</h2>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <CardElement className="StripeElement" />
      <div className="form-group">
        <label>Amount:</label>
        <p>${amount}</p>
      </div>
      <button type="submit" disabled={loading || !stripe || !elements}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

const PaymentsPage = () => {
  const location = useLocation();
  const { amount } = location.state || {};

  if (!amount) {
    return <p>No amount specified for payment.</p>;
  }

  return (
    <div className="payments-page">
      <h2>Make a Payment</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm amount={amount} />
      </Elements>
    </div>
  );
};

export default PaymentsPage;