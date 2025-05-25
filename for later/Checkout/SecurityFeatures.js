import React from 'react';
import { Shield, RefreshCw, Lock } from 'lucide-react';

const SecurityFeatures = () => {
  return (
    <div className="security-features">
      <div className="feature">
        <Shield size={24} />
        <div>
          <h4>Secure Shopping</h4>
          <p>Protected with bank-level security</p>
        </div>
      </div>
      <div className="feature">
        <RefreshCw size={24} />
        <div>
          <h4>30-Day Returns</h4>
          <p>Full refund on unworn items</p>
        </div>
      </div>
      <div className="feature">
        <Lock size={24} />
        <div>
          <h4>Encrypted Payment</h4>
          <p>Your data is fully protected</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityFeatures;