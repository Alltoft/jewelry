import React, { useState } from 'react';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import ConfirmationStep from './ConfirmationStep';
import './CheckoutForm.css';

const CheckoutForm = ({ amount, currentStep, setStep }) => {
  const [shippingDetails, setShippingDetails] = useState(null);

  // Helper function to scroll to top and change step
  const changeStepAndScrollToTop = (newStep) => {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    setStep(newStep);
  };

  const handleShippingSubmit = (formData) => {
    setShippingDetails(formData);
    changeStepAndScrollToTop(currentStep + 1);
  };

  const handlePaymentSubmit = () => {
    // Always pass 'cod' as the payment method
    localStorage.setItem('paymentMethod', 'cod');
    changeStepAndScrollToTop(currentStep + 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ShippingForm 
            onSubmit={handleShippingSubmit} 
            initialData={shippingDetails}
          />
        );
      case 2:
        return (
          <PaymentForm 
            onSubmit={handlePaymentSubmit}
            amount={amount}
            shippingDetails={shippingDetails}
            setStep={changeStepAndScrollToTop}
          />
        );
      case 3:
        return <ConfirmationStep paymentMethod="cod" />;
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
