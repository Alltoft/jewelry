import React, { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import ConfirmationStep from './ConfirmationStep';
import './CheckoutForm.css';

const CheckoutForm = ({ amount, currentStep, setStep }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [shippingDetails, setShippingDetails] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  // Save the payment method when it changes
  useEffect(() => {
    if (selectedPaymentMethod) {
      localStorage.setItem('paymentMethod', selectedPaymentMethod);
    }
  }, [selectedPaymentMethod]);

  const handleShippingSubmit = (formData) => {
    setShippingDetails(formData);
    setStep(currentStep + 1);
  };

  const handlePaymentSubmit = (paymentMethod = 'card') => {
    setSelectedPaymentMethod(paymentMethod);
    setStep(currentStep + 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ShippingForm 
            onSubmit={handleShippingSubmit} 
            initialData={shippingDetails} // Pass stored data
          />
        );
      case 2:
        return (
          <PaymentForm 
            onSubmit={handlePaymentSubmit}
            stripe={stripe}
            elements={elements}
            amount={amount}
            shippingDetails={shippingDetails}
            setStep={setStep}
          />
        );
      case 3:
        return <ConfirmationStep paymentMethod={selectedPaymentMethod} />;
      default:
        return null;
    }
  };

  return (
    <div className="checkout-form">
      {renderStep()}
    </div>
  );
};

export default CheckoutForm;