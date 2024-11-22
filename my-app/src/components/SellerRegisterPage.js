// SellerRegisterPage.js
import React from 'react';

const SellerRegisterPage = ({ formData, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <h2>Seller Registration</h2>
      <input
        type="text"
        name="store_name"
        value={formData.store_name}
        onChange={onChange}
        placeholder="Store Name"
        required
      />
      <textarea
        name="store_description"
        value={formData.store_description}
        onChange={onChange}
        placeholder="Store Description"
        required
      />
      <input
        type="text"
        name="license_number"
        value={formData.license_number}
        onChange={onChange}
        placeholder="License Number"
        required
      />
      <input
        type="text"
        name="bank_account"
        value={formData.bank_account}
        onChange={onChange}
        placeholder="Bank Account"
        required
      />
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Address"
        required
      />
      <input
        type="text"
        name="phone_number"
        value={formData.phone_number}
        onChange={onChange}
        placeholder="Phone Number"
      />
      <button type="submit">Register as Seller</button>
    </form>
  );
};

export default SellerRegisterPage;