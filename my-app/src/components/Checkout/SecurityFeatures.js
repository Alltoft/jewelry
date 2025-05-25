import React from 'react';
import { Shield, RefreshCw, Lock, Award } from 'lucide-react';
import './SecurityFeatures.css';

const SecurityFeatures = () => {
  return (
    <div className="security-features">
      <div className="title">Your Assurance</div>
      
      <div className="feature">
        <div className="feature-icon">
          <Shield size={18} />
        </div>
        <div>
          <h4>Secure Shopping</h4>
          <p>Protected with bank-level security measures</p>
        </div>
      </div>
      
      <div className="feature">
        <div className="feature-icon">
          <RefreshCw size={18} />
        </div>
        <div>
          <h4>30-Day Returns</h4>
          <p>Full refund on unworn jewelry items</p>
        </div>
      </div>
      
      <div className="feature">
        <div className="feature-icon">
          <Lock size={18} />
        </div>
        <div>
          <h4>Private Transaction</h4>
          <p>Your personal data is fully protected</p>
        </div>
      </div>
      
      <div className="feature">
        <div className="feature-icon">
          <Award size={18} />
        </div>
        <div>
          <h4>Quality Guarantee</h4>
          <p>Every piece meets our luxury standards</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityFeatures;