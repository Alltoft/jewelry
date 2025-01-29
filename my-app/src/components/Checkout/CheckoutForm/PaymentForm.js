import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { CardElement } from '@stripe/react-stripe-js';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import './PaymentForm.css';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      fontFamily: 'var(--font-body)',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const PaymentForm = ({ onSubmit, stripe, elements, amount, shippingDetails, setStep }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const { user } = useContext(AuthContext);
  const payload = {
    origin: {
      address: {
        streetLines: ["123 Merchant Street"],
        city: "San Francisco",
        stateOrProvinceCode: "CA",
        postalCode: "94105",
        countryCode: "US"
      }
    },
    destination: {
      address: {
        streetLines: [shippingDetails.address],
        city: shippingDetails.city,
        stateOrProvinceCode: shippingDetails.state,
        postalCode: shippingDetails.zipCode,
        countryCode: "US"
      }
    },
    package_details: {
      weight: {
        value: 1.0,
        units: "LB"
      },
      dimensions: {
        length: 10,
        width: 10,
        height: 10,
        units: "IN"
      }
    },
    service_type: localStorage.getItem('selectedRate') ? 
      JSON.parse(localStorage.getItem('selectedRate')).serviceType : 
      "FEDEX_GROUND",
    amount: amount,
    shipper: {
      name: "John Smith",
      email: "company@example.com",
      phoneNumber: "1234567890",
      companyName: "Your Company"
    },
    recipient: {
      name: shippingDetails.firstName + " " + shippingDetails.lastName,
      email: shippingDetails.email,
      phoneNumber: shippingDetails.phone
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment processing is not available. Please try again later.');
      return;
    }

    if (!cardComplete) {
      setError('Please complete your card information.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get payment intent from your server
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
        console.log('\n\n\n\nshippingDetails: ', payload, '\n\n\n\n');

        // if (shippingDetails.email) {
        //   await axios.post('/send-email', {
        //     email: shippingDetails.email,
        //     amount: amount,
        //   });
        // }
        if (user) {
          console.log('streetlines: ', shippingDetails);
          await axios.post('/create-shipment', {
            origin: {
              address: {
                streetLines: ["123 Merchant Street"],
                city: "San Francisco",
                stateOrProvinceCode: "CA",
                postalCode: "94105",
                countryCode: "US"
              }
            },
            destination: {
              address: {
                streetLines: [shippingDetails.address],
                city: shippingDetails.city,
                stateOrProvinceCode: shippingDetails.state,
                postalCode: shippingDetails.zipCode,
                countryCode: "US"
              }
            },
            package_details: {
              weight: {
                value: 1.0,
                units: "LB"
              },
              dimensions: {
                length: 10,
                width: 10,
                height: 10,
                units: "IN"
              }
            },
            service_type: localStorage.getItem('selectedRate') ? 
              JSON.parse(localStorage.getItem('selectedRate')).serviceType : 
              "FEDEX_GROUND",
            amount: amount,
            shipper: {
              name: "John Smith",
              email: "company@example.com",
              phoneNumber: "1234567890",
              companyName: "Your Company"
            },
            recipient: {
              name: shippingDetails.firstName + " " + shippingDetails.lastName,
              email: shippingDetails.email,
              phoneNumber: shippingDetails.phone
            }
          });
          await axios.post('/sold');
          await axios.delete('cart/clear');
        }
        localStorage.removeItem('selectedRate');
        localStorage.removeItem('cart');
        onSubmit(e);
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (err) {
      setError(err.message);
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

      <form onSubmit={handleSubmit} className="payment-form">
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

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <button 
          type="submit" 
          className="pay-btn"
          disabled={loading || !stripe || !cardComplete}
        >
          {loading ? (
            <span className="loading-text">Processing payment...</span>
          ) : (
            <>Pay ${parseFloat(amount).toFixed(2)}</>
          )}
        </button>
      </form>
    </>
  );
};

export default PaymentForm;