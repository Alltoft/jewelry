import React, { useState, useContext, useEffect } from 'react';
import './ShippingForm.css';
import { AuthContext } from '../../../context/AuthContext';
import GoogleMaps from '../../GoogleMaps';
import ShippingRates from './ShippingRates';
import axios from 'axios';

const ShippingForm = ({ onSubmit, initialData, cart }) => {
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
    zipCode: '',
    country: 'US'
  });
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ShippingRate = JSON.parse('[]');

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
        zipCode: user.zipCode || '',
        country: user.country || 'US'
      }));
    }
  }, [user]);




  const calculatePackageDetails = () => {
    // Default values based on cart items
    // This should be replaced with actual calculations based on products
    return {
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
    };
  };

  const isAddressComplete = (data) => {
    return (
      data.address.trim() !== '' &&
      data.city.trim() !== '' &&
      data.state.trim() !== '' &&
      data.zipCode.length === 5
    );
  };

  // Add validator function
  const hasValidZipCode = (zipCode) => {
    return zipCode && zipCode.length === 5 && /^\d{5}$/.test(zipCode);
  };

  // Update useEffect to check zip code
  useEffect(() => {
    if (hasValidZipCode(formData.zipCode)) {
      fetchShippingRates();
    }
  }, [formData.zipCode]);

  const fetchShippingRates = async () => {
    if (!hasValidZipCode(formData.zipCode)) return;
    
    setLoading(true);
    try {
      const response = await axios.post('/get-rates', {
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
            streetLines: [formData.address],
            city: formData.city,
            stateOrProvinceCode: "",
            postalCode: formData.zipCode,
            countryCode: formData.country
          }
        },
        package_details: calculatePackageDetails()
      });

      const formattedRates = response.data.output.rateReplyDetails.map(rate => ({
        serviceType: rate.serviceName,
        transitTime: rate.transitTime,
        amount: parseFloat(rate.ratedShipmentDetails[0].totalNetCharge),
        guarantees: rate.serviceGuarantees || [],
        deliveryDate: rate.deliveryDate
      }));

      setShippingRates(formattedRates);
      setError(null);
    } catch (err) {
      setError('Unable to fetch shipping rates');
      setShippingRates([]);
    } finally {
      setLoading(false);
    }
  };

  const isValidStateCode = (state) => {
    return /^[A-Z]{2}$/.test(state.toUpperCase());
  };

  const handleSelectRate = (rate) => {
    localStorage.setItem('selectedRate', JSON.stringify(rate));
    // Force OrderSummary update
    const event = new CustomEvent('shippingRateUpdate', { detail: rate });
    window.dispatchEvent(event);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'state') {
      const stateValue = value.toUpperCase();
      setFormData(prev => ({
        ...prev,
        [name]: isValidStateCode(stateValue) ? stateValue : ''
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceSelected = (formattedAddress) => {
    const newFormData = {
      ...formData,
      address: formattedAddress.streetLines[0],
      city: formattedAddress.city,
      state: formattedAddress.state,
      zipCode: formattedAddress.zipCode,
      country: formattedAddress.country || 'US'
    };

    setFormData(newFormData);
    fetchShippingRates(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRate) {
      setError('Please select a shipping method before continuing.');
      return;
    }
    onSubmit({ ...formData, shippingRate: selectedRate });
  };

  return (
    <form onSubmit={handleSubmit} className="shipping-form">
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
            placeholder='(123) 456-7890'
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Address</label>
        <GoogleMaps onPlaceSelected={handlePlaceSelected} />
      </div>

      <div className="form-group">
        <label>Apartment, suite, etc. (optional)</label>
        <input
          type="text"
          name="apartment"
          value={formData.apartment}
          placeholder='Enter your apartment number'
          onChange={handleChange}
        />
      </div>

      <div className="form-row three-columns">
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder='City'
            required
          />
        </div>
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder='State'
          />
        </div>
        <div className="form-group">
          <label>ZIP Code</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            maxLength={5}
            pattern="[0-9]{5}"
            required
          />
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Calculating shipping rates...</p>
        </div>
      )}

      {error && (
        <div className="shipping-option free-shipping">
          <input 
            type="radio" 
            id="free-shipping" 
            name="shipping-option" 
            checked={true} 
            onChange={() => {
              const freeShippingOption = {
                serviceType: "FREE Shipping",
                amount: 0,
                transitTime: "3-5 business days"
              };
              setSelectedRate(freeShippingOption);
              handleSelectRate(freeShippingOption);
            }}
          />
          <label htmlFor="free-shipping">
            <span className="option-name">FREE Shipping</span>
            <span className="option-price">$0.00</span>
            <span className="option-eta">3-5 business days</span>
          </label>
        </div>
      )}

      {shippingRates.length > 0 && !error && (
        <ShippingRates
          rates={shippingRates}
          selectedRate={selectedRate}
          onSelectRate={(rate) => {
            setSelectedRate(rate);
            handleSelectRate(rate);
          }}
        />
      )}

      <button 
        type="submit" 
        className="continue-btn"
        disabled={loading}
      >
        Continue to Payment
      </button>
    </form>
  );
};

export default ShippingForm;
