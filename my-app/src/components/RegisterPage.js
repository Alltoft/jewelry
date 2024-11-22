// RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // General fields
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    phone_number: '',
    user_role: '',
    // Seller specific
    store_name: '',
    store_description: '',
    license_number: '',
    bank_account: '',
    address: '',
    // Customer specific
    shipping_address: '',
    gender: '',
    brith_date: '',
    jewelery_preference: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const UserRole = {
    SELLER: 'Seller',
    CUSTOMER: 'Customer',
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    // Validate general fields
    if (!formData.name.trim()) newErrors.name = 'First Name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.phone_number.trim())
      newErrors.phone_number = 'Phone Number is required';
    if (!formData.user_role) newErrors.user_role = 'User Role is required';

    // Validate role-specific fields
    if (formData.user_role === UserRole.SELLER) {
      if (!formData.store_name.trim())
        newErrors.store_name = 'Store Name is required';
      if (!formData.store_description.trim())
        newErrors.store_description = 'Store Description is required';
      if (!formData.license_number.trim())
        newErrors.license_number = 'License Number is required';
      if (!formData.bank_account.trim())
        newErrors.bank_account = 'Bank Account is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    } else if (formData.user_role === UserRole.CUSTOMER) {
      if (!formData.shipping_address.trim())
        newErrors.shipping_address = 'Shipping Address is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.brith_date) newErrors.brith_date = 'Birth Date is required';
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit general registration data
      const generalData = {
        name: formData.name,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        user_role: formData.user_role,
      };

      const generalResponse = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generalData),
      });

      if (!generalResponse.ok) {
        const error = await generalResponse.json();
        throw new Error(error.message || 'General registration failed');
      }

      // Submit role-specific registration data
      if (formData.user_role === UserRole.SELLER) {
        const sellerData = {
          store_name: formData.store_name,
          store_description: formData.store_description,
          license_number: formData.license_number,
          bank_account: formData.bank_account,
          address: formData.address,
          phone_number: formData.phone_number,
        };

        const sellerResponse = await fetch('/seller/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sellerData),
        });

        if (!sellerResponse.ok) {
          const error = await sellerResponse.json();
          throw new Error(error.message || 'Seller registration failed');
        }
      } else if (formData.user_role === UserRole.CUSTOMER) {
        const customerData = {
          shipping_address: formData.shipping_address,
          gender: formData.gender,
          brith_date: formData.brith_date,
          jewelery_preference: formData.jewelery_preference,
          phone_number: formData.phone_number,
        };

        const customerResponse = await fetch('/customer/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData),
        });

        if (!customerResponse.ok) {
          const error = await customerResponse.json();
          throw new Error(error.message || 'Customer registration failed');
        }
      }

      // Handle successful registration
      alert('Registration successful!');
      // Reset form
      setFormData({
        name: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        phone_number: '',
        user_role: '',
        store_name: '',
        store_description: '',
        license_number: '',
        bank_account: '',
        address: '',
        shipping_address: '',
        gender: '',
        brith_date: '',
        jewelery_preference: '',
      });
      setErrors({});
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <h2>Register</h2>
        {/* General Fields */}
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="First Name"
            required
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={onChange}
            placeholder="Last Name"
            required
          />
          {errors.lastname && <span className="error">{errors.lastname}</span>}
        </div>
        <div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={onChange}
            placeholder="Username"
            required
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Email"
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Password"
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={onChange}
            placeholder="Phone Number"
            required
          />
          {errors.phone_number && (
            <span className="error">{errors.phone_number}</span>
          )}
        </div>
        {/* Role Selection */}
        <div>
          <select
            name="user_role"
            value={formData.user_role}
            onChange={onChange}
            required
          >
            <option value="">Select Role</option>
            <option value={UserRole.SELLER}>{UserRole.SELLER}</option>
            <option value={UserRole.CUSTOMER}>{UserRole.CUSTOMER}</option>
          </select>
          {errors.user_role && (
            <span className="error">{errors.user_role}</span>
          )}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      {/* Conditionally Render Role-Specific Fields */}
      {formData.user_role === UserRole.SELLER && (
        <div>
          <h3>Seller Details</h3>
          <div>
            <input
              type="text"
              name="store_name"
              value={formData.store_name}
              onChange={onChange}
              placeholder="Store Name"
              required
            />
            {errors.store_name && (
              <span className="error">{errors.store_name}</span>
            )}
          </div>
          <div>
            <textarea
              name="store_description"
              value={formData.store_description}
              onChange={onChange}
              placeholder="Store Description"
              required
            />
            {errors.store_description && (
              <span className="error">{errors.store_description}</span>
            )}
          </div>
          <div>
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={onChange}
              placeholder="License Number"
              required
            />
            {errors.license_number && (
              <span className="error">{errors.license_number}</span>
            )}
          </div>
          <div>
            <input
              type="text"
              name="bank_account"
              value={formData.bank_account}
              onChange={onChange}
              placeholder="Bank Account"
              required
            />
            {errors.bank_account && (
              <span className="error">{errors.bank_account}</span>
            )}
          </div>
          <div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={onChange}
              placeholder="Address"
              required
            />
            {errors.address && (
              <span className="error">{errors.address}</span>
            )}
          </div>
          <div>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={onChange}
              placeholder="Phone Number"
            />
          </div>
        </div>
      )}

      {formData.user_role === UserRole.CUSTOMER && (
        <div>
          <h3>Customer Details</h3>
          <div>
            <input
              type="text"
              name="shipping_address"
              value={formData.shipping_address}
              onChange={onChange}
              placeholder="Shipping Address"
              required
            />
            {errors.shipping_address && (
              <span className="error">{errors.shipping_address}</span>
            )}
          </div>
          <div>
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
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>
          <div>
            <input
              type="date"
              name="brith_date"
              value={formData.brith_date}
              onChange={onChange}
              required
            />
            {errors.brith_date && (
              <span className="error">{errors.brith_date}</span>
            )}
          </div>
          <div>
            <input
              type="text"
              name="jewelery_preference"
              value={formData.jewelery_preference}
              onChange={onChange}
              placeholder="Jewelery Preference"
            />
          </div>
          <div>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={onChange}
              placeholder="Phone Number"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPage;