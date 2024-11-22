// CustomerRegisterPage.js
import React from 'react';

const CustomerRegisterPage = ({ formData, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <h2>Customer Registration</h2>
      <input
        type="text"
        name="shipping_address"
        value={formData.shipping_address}
        onChange={onChange}
        placeholder="Shipping Address"
        required
      />
      <select
        name="gender"
        value={formData.gender}
        onChange={onChange}
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="date"
        name="brith_date"
        value={formData.brith_date}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="jewelery_preference"
        value={formData.jewelery_preference}
        onChange={onChange}
        placeholder="Jewelery Preference"
      />
      <input
        type="text"
        name="phone_number"
        value={formData.phone_number}
        onChange={onChange}
        placeholder="Phone Number"
      />
      <button type="submit">Register as Customer</button>
    </form>
  );
};

export default CustomerRegisterPage;