import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gem as GemIcon, 
  User as UserIcon, 
  Mail as MailIcon, 
  Key as KeyIcon, 
  Phone as PhoneIcon, 
  Store as StoreIcon,
  Building as BuildingIcon,
  CreditCard as CreditCardIcon,
  MapPin as MapPinIcon,
  Badge as BadgeIcon,
  FileText as FileTextIcon,
  Calendar as CalendarIcon,
} from 'lucide-react';
import './Register.css';
const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    birth_date: '',
    jewelry_preference: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'First Name is required';
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!formData.lastname.trim()) newErrors.lastname = 'Last Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
        newErrors.email = 'Invalid email address';
      }
      if (!formData.password) newErrors.password = 'Password is required';
      if (!formData.user_role) newErrors.user_role = 'Please select a role';
    }

    if (currentStep === 2) {
      if (formData.user_role === UserRole.SELLER) {
        if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone Number is required';
        if (!formData.store_name.trim()) newErrors.store_name = 'Store Name is required';
        if (!formData.store_description.trim()) newErrors.store_description = 'Store Description is required';
        if (!formData.license_number.trim()) newErrors.license_number = 'License Number is required';
        if (!formData.bank_account.trim()) newErrors.bank_account = 'Bank Account is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
      } else if (formData.user_role === UserRole.CUSTOMER) {
        if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone Number is required';
        if (!formData.shipping_address.trim()) newErrors.shipping_address = 'Shipping Address is required';
        if (!formData.gender.trim()) newErrors.gender = 'Gender is required';
        if (!formData.birth_date) newErrors.birth_date = 'Birth Date is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Register general user first
      const generalResponse = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          lastname: formData.lastname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone_number,
          user_role: formData.user_role,
        }),
      });

      if (!generalResponse.ok) {
        setCurrentStep(1);
        const errorData = await generalResponse.json();
        throw new Error(errorData.message || generalResponse.statusText);
      }

      // Register role-specific details
      const roleEndpoint = formData.user_role === UserRole.SELLER ? '/seller/register' : '/customer/register';
      const roleData = formData.user_role === UserRole.SELLER ? {
        store_name: formData.store_name,
        store_description: formData.store_description,
        license_number: formData.license_number,
        bank_account: formData.bank_account,
        address: formData.address,
        phone_number: formData.phone_number,
      } : {
        shipping_address: formData.shipping_address,
        gender: formData.gender,
        birth_date: formData.birth_date,
        jewelry_preference: formData.jewelry_preference,
        phone_number: formData.phone_number,
      };

      const roleResponse = await fetch(roleEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData),
      });

      if (!roleResponse.ok) {
        throw new Error('Role registration failed');
      }
      const message = document.createElement('div');
      message.textContent = 'Account created successfully';
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 16px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
      `;
      document.body.appendChild(message);

      // Wait for message to show, then navigate and refresh
      setTimeout(() => {
        message.remove();
        navigate('/');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }, 1000);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-left">
          <div className="auth-overlay"></div>
        </div>
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-header">
              <GemIcon className="auth-logo" size={32} />
              <h1>Create Account</h1>
              <p>Join our exclusive jewelry community</p>
            </div>

            <div className="register-progress">
              <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                <span>1</span>
                <p>Account</p>
              </div>
              <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                <span>2</span>
                <p>Details</p>
              </div>
              <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                <span>3</span>
                <p>Complete</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="auth-form">
              {errors.submit && <div className="auth-error">{errors.submit}</div>}

              {currentStep === 1 && (
                <div className="form-step">
                  <div className="form-group">
                    <label htmlFor="name">First Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="Enter your first name"
                      />
                      <UserIcon className="input-icon" size={18} />
                    </div>
                    {errors.name && <span className="error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastname">Last Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={onChange}
                        placeholder="Enter your last name"
                      />
                      <UserIcon className="input-icon" size={18} />
                    </div>
                    {errors.lastname && <span className="error">{errors.lastname}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">User Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={onChange}
                        placeholder="Enter your last name"
                      />
                      <UserIcon className="input-icon" size={18} />
                    </div>
                    {errors.username && <span className="error">{errors.username}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        placeholder="Enter your email"
                      />
                      <MailIcon className="input-icon" size={18} />
                    </div>
                    {errors.email && <span className="error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        placeholder="Create a password"
                      />
                      <KeyIcon className="input-icon" size={18} />
                    </div>
                    {errors.password && <span className="error">{errors.password}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="user_role">Account Type</label>
                    <div className="input-wrapper">
                      <select
                        id="user_role"
                        name="user_role"
                        value={formData.user_role}
                        onChange={onChange}
                      >
                        <option value="">Select your role</option>
                        <option value={UserRole.CUSTOMER}>Customer</option>
                        <option value={UserRole.SELLER}>Seller</option>
                      </select>
                      <StoreIcon className="input-icon" size={18} />
                    </div>
                    {errors.user_role && <span className="error">{errors.user_role}</span>}
                  </div>

                  <button type="button" className="auth-submit" onClick={handleNext}>
                    Continue
                  </button>
                </div>
              )}

              {currentStep === 2 && formData.user_role === UserRole.SELLER && (
                <div className="form-step">
                  <div className="form-group">
                    <label htmlFor="store_name">Store Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="store_name"
                        name="store_name"
                        value={formData.store_name}
                        onChange={onChange}
                        placeholder="Enter your store name"
                      />
                      <StoreIcon className="input-icon" size={18} />
                    </div>
                    {errors.store_name && <span className="error">{errors.store_name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="store_description">Store Description</label>
                    <div className="input-wrapper">
                      <textarea
                        id="store_description"
                        name="store_description"
                        value={formData.store_description}
                        onChange={onChange}
                        placeholder="Enter your store description"
                      />
                      <FileTextIcon className="input-icon" size={18} />
                    </div>
                    {errors.store_description && <span className="error">{errors.store_description}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone_number">Phone Number</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={onChange}
                        placeholder="Enter your phone number"
                      />
                      <PhoneIcon className="input-icon" size={18} />
                    </div>
                    {errors.phone_number && <span className="error">{errors.phone_number}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="license_number">License Number</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="license_number"
                        name="license_number"
                        value={formData.license_number}
                        onChange={onChange}
                        placeholder="Enter your license number"
                      />
                      <BadgeIcon className="input-icon" size={18} />
                    </div>
                    {errors.license_number && <span className="error">{errors.license_number}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="bank_account">Bank Account</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="bank_account"
                        name="bank_account"
                        value={formData.bank_account}
                        onChange={onChange}
                        placeholder="Enter your bank account"
                      />
                      <CreditCardIcon className="input-icon" size={18} />
                    </div>
                    {errors.bank_account && <span className="error">{errors.bank_account}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={onChange}
                        placeholder="Enter your address"
                      />
                      <MapPinIcon className="input-icon" size={18} />
                    </div>
                    {errors.address && <span className="error">{errors.address}</span>}
                  </div>
                  <div className="form-buttons">
                    <button type="button" className="auth-back" onClick={handleBack}>
                      Back
                    </button>
                    <button type="button" className="auth-submit" onClick={handleNext}>
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && formData.user_role === UserRole.CUSTOMER && (
                <div className="form-step">
                  <div className="form-group">
                    <label htmlFor="shipping_address">Shipping Address</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="shipping_address"
                        name="shipping_address"
                        value={formData.shipping_address}
                        onChange={onChange}
                        placeholder="Enter your shipping address"
                      />
                      <BuildingIcon className="input-icon" size={18} />
                    </div>
                    {errors.shipping_address && <span className="error">{errors.shipping_address}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <div className="input-wrapper">
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={onChange}
                      >
                        <option value="">Select your gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <UserIcon className="input-icon" size={18} />
                    </div>
                    {errors.gender && <span className="error">{errors.gender}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone_number">Phone Number</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={onChange}
                        placeholder="Enter your phone number"
                      />
                      <PhoneIcon className="input-icon" size={18} />
                    </div>
                    {errors.phone_number && <span className="error">{errors.phone_number}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="birth_date">Birth Date</label>
                    <div className="input-wrapper">
                      <input
                        type="date"
                        id="birth_date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={onChange}
                      />
                      <CalendarIcon className="input-icon" size={18} />
                    </div>
                    {errors.birth_date && <span className="error">{errors.birth_date}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="jewelry_preference">Jewelry Preference</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="jewelry_preference"
                        name="jewelry_preference"
                        value={formData.jewelry_preference}
                        onChange={onChange}
                        placeholder="Enter your jewelry preference"
                      />
                      <GemIcon className="input-icon" size={18} />
                    </div>
                    {errors.jewelry_preference && <span className="error">{errors.jewelry_preference}</span>}
                  </div>
                  <div className="form-buttons">
                    <button type="button" className="auth-back" onClick={handleBack}>
                      Back
                    </button>
                    <button type="button" className="auth-submit" onClick={handleNext}>
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="form-step">
                  <div className="completion-message">
                    <h3>Almost there!</h3>
                    <p>Please review your information before completing registration.</p>
                  </div>

                  <div className="form-summary">
                    <div className="summary-item">
                      <span>Name:</span>
                      <p>{`${formData.name} ${formData.lastname}`}</p>
                    </div>
                    <div className="summary-item">
                      <span>User Name:</span>
                      <p>{`${formData.username}`}</p>
                    </div>
                    <div className="summary-item">
                      <span>Email:</span>
                      <p>{formData.email}</p>
                    </div>
                    <div className="summary-item">
                      <span>Role:</span>
                      <p>{formData.user_role}</p>
                    </div>
                    <div className="summary-item">
                      <span>Phone:</span>
                      <p>{formData.phone_number}</p>
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button type="button" className="auth-back" onClick={handleBack}>
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="auth-submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Complete Registration'}
                    </button>
                  </div>
                </div>
              )}

              <div className="auth-links">
                <div className="auth-separator">
                  <span>Already have an account?</span>
                </div>
                <Link to="/login" className="auth-switch-btn">
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;