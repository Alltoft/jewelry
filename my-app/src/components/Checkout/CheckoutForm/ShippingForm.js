import React, { useState, useContext, useEffect } from 'react';
import './ShippingForm.css';
import { AuthContext } from '../../../context/AuthContext';

const ShippingForm = ({ onSubmit, initialData }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialData || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => (initialData || {
        ...prev,
        firstName: user.name || '',
        lastName: user.lastname || '',
        email: user.email || '',
        phone: user.phone_number || '',
        address: user.shipping_address || '',
        apartment: user.apartment || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || ''
      }));
    }
  }, [user, initialData]);

  const isValidStateCode = (state) => {
    return /^[A-Z]{2}$/.test(state.toUpperCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'state') {
      const stateValue = value.toUpperCase();
      setFormData(prev => ({
        ...prev,
        [name]: isValidStateCode(stateValue) ? stateValue : stateValue.slice(0, 2)
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.address || !formData.city || 
        !formData.state || !formData.zipCode) {
      setError('All fields are required');
      return;
    }
    
    if (!/^\d{5}$/.test(formData.zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Submit the form
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="shipping-form">
      <div className="shipping-info">
        <h2>Shipping Address</h2>
        <p>Enter the address where you want your order to be delivered. Please note that shipping is handled by the customer.</p>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder='Enter your first name'
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder='Enter your last name'
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Enter your email'
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder='Enter your phone number'
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder='Enter your street address'
          required
        />
      </div>

      <div className="form-group">
        <label>Apartment, suite, etc. (Optional)</label>
        <input
          type="text"
          name="apartment"
          value={formData.apartment}
          onChange={handleChange}
          placeholder='Apartment, suite, unit, building, floor, etc.'
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder='Enter your city'
            required
          />
        </div>
        <div className="form-group">
          <label>State/Province</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder='Enter state code (e.g., CA)'
            maxLength={2}
            required
          />
        </div>
        <div className="form-group">
          <label>ZIP Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder='Enter your ZIP code'
            required
            maxLength={5}
            pattern="\d{5}"
          />
        </div>
      </div>

      <div className="shipping-note">
        <p><strong>Note:</strong> Shipping is handled within Morocco. After placing your order, our team will contact you regarding pickup or delivery arrangements.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="submit-button">
        Continue to Payment
      </button>
    </form>
  );
};

export default ShippingForm;
