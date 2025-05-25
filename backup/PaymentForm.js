import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { AlertCircle, ArrowLeft, Package, Clock, ShieldCheck, Banknote } from 'lucide-react';
import './PaymentForm.css';

const PaymentForm = ({ onSubmit, amount, shippingDetails, setStep }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  
  // Simplified payload with just the essential customer information
  const payload = {
    destination: {
      address: {
        streetLines: [shippingDetails.address],
        city: shippingDetails.city,
        state: shippingDetails.state,
        zipCode: shippingDetails.zipCode,
        country: shippingDetails.country || 'US'
      }
    },
    amount: amount,
    recipient: {
      name: shippingDetails.firstName + " " + shippingDetails.lastName,
      email: shippingDetails.email,
      phoneNumber: shippingDetails.phone
    },
    payment_method: 'cod',
    payment_status: 'pending'
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      if (!stripe || !elements) {
        setError('Payment processing is not available. Please try again later.');
        return;
      }

      if (!cardComplete) {
        setError('Please complete your card information.');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      if (paymentMethod === 'card') {
        // Process credit card payment via Stripe
        const response = await axios.post('/create-payment', {
          amount,
          customer_details: {
            email: shippingDetails.email,
            phone: shippingDetails.phone,
          }
        });
        
        const clientSecret = response.data.client_secret;
        
        const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                email: shippingDetails.email,
                phone: shippingDetails.phone,
              },
            },
          }
        );

        if (paymentError) {
          throw new Error(paymentError.message);
        }
        
        if (paymentIntent.status === 'succeeded') {
          await processOrder(true); // true indicates payment completed
        } else {
          throw new Error('Payment failed. Please try again.');
        }
      } else {
        // Process Cash on Delivery payment
        await processOrder(false); // false indicates payment pending (COD)
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processOrder = async (isPaid) => {
    // Create shipment
    if (user) {
      try {
        // Add payment_method to the payload
        const orderPayload = {
          ...payload,
          payment_method: paymentMethod,
          payment_status: isPaid ? 'paid' : 'pending'
        };
        
        // Create shipment
        await axios.post('/create-shipment', orderPayload);
        
        // Mark items as sold with payment information
        await axios.post('/sold', {
          payment_method: paymentMethod,
          payment_status: isPaid ? 'paid' : 'pending'
        });
        
        // Clear cart
        await axios.delete('cart/clear');
      } catch (err) {
        throw new Error('Error processing order: ' + err.message);
      }
    }
    
    // Clean up local storage
    localStorage.removeItem('selectedRate');
    localStorage.removeItem('cart');
    
    // Move to confirmation step and pass the payment method
    onSubmit(paymentMethod);
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

      <div className="payment-method-selection">
        <h2>Select Payment Method</h2>
        
        <div className="payment-methods">
          <div 
            className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            <div className="payment-method-header">
              <CreditCard size={24} />
              <h3>Credit Card</h3>
            </div>
            <p>Pay now with your credit or debit card</p>
            {paymentMethod === 'card' && <div className="payment-method-check"></div>}
          </div>
          
          <div 
            className={`payment-method-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('cod')}
          >
            <div className="payment-method-header">
              <Banknote size={24} />
              <h3>Cash on Delivery</h3>
            </div>
            <p>Pay when your order is delivered</p>
            {paymentMethod === 'cod' && <div className="payment-method-check"></div>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        {paymentMethod === 'card' && (
          <div className="card-element-container">
            <label>Card Details</label>
            <CardElement 
              options={CARD_ELEMENT_OPTIONS} 
              onChange={(e) => {
                setCardComplete(e.complete);
                if (e.error) {
                  console.log('e.error.message');
                  setError(e.error.message);
                } else {
                  setError(null);
                }
              }}
            />
          </div>
        )}

        {paymentMethod === 'cod' && (
          <div className="cod-info">
            <div className="cod-benefits">
              <div className="cod-benefit">
                <ShieldCheck size={20} />
                <div>
                  <h4>Safe & Secure</h4>
                  <p>Inspect your jewelry before paying</p>
                </div>
              </div>
              <div className="cod-benefit">
                <Package size={20} />
                <div>
                  <h4>Premium Packaging</h4>
                  <p>Delivered in our signature luxury box</p>
                </div>
              </div>
              <div className="cod-benefit">
                <Clock size={20} />
                <div>
                  <h4>Easy Process</h4>
                  <p>Pay with cash or card to our delivery partner</p>
                </div>
              </div>
            </div>
            <div className="cod-terms">
              <p>By selecting Cash on Delivery, you agree that you will be present at the delivery address to receive and pay for your order.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <button 
          type="submit" 
          className="pay-btn"
          disabled={loading || (paymentMethod === 'card' && (!stripe || !cardComplete))}
        >
          {loading ? (
            <span className="loading-text">Processing order...</span>
          ) : paymentMethod === 'card' ? (
            <>Pay ${parseFloat(amount).toFixed(2)}</>
          ) : (
            <>Place Order (Pay on Delivery)</>
          )}
        </button>
      </form>
    </>
  );
};

export default PaymentForm;