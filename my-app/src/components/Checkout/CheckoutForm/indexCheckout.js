import React, { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import ConfirmationStep from './ConfirmationStep';
import './CheckoutForm.css';

const CheckoutForm = ({ amount, currentStep, setStep }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [shippingDetails, setShippingDetails] = useState(null);

  const handleShippingSubmit = (formData) => {
    setShippingDetails(formData);
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
            onSubmit={() => setStep(currentStep + 1)}
            stripe={stripe}
            elements={elements}
            amount={amount}
            shippingDetails={shippingDetails}
            setStep={setStep}
          />
        );
      case 3:
        return <ConfirmationStep />;
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