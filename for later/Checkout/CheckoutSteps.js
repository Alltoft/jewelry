import React from 'react';
import { Check } from 'lucide-react';

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, name: 'Shipping Details' },
    { number: 2, name: 'Payment Information' },
    { number: 3, name: 'Order Confirmation' }
  ];

  return (
    <div className="checkout-steps">
      {steps.map(({ number, name }) => (
        <div 
          key={number}
          className={`step 
                      ${currentStep === 3 ? 'completed' : 
                      `${currentStep >= number ? 'active' : ''} 
                      ${currentStep > number ? 'completed' : ''}`
                    }`}
        >
          <span className="step-number">
          {currentStep === 3 ? <Check size={16} /> : currentStep > number ? <Check size={16} /> : number}
          </span>
          <span className="step-name">{name}</span>
          {number < steps.length && <span className="step-line" />}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;