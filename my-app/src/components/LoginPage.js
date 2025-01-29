import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../api';
import { GemIcon, KeyIcon } from 'lucide-react';
import './Login.css';

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username_or_email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { username_or_email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await loginUser({
        username: username_or_email,
        email: username_or_email,
        password,
      });
      setUser(res.data);
        navigate('/');
        setTimeout(() => {
          window.location.reload();
        }, 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
              <h1>Welcome Back</h1>
              <p>Sign in to your jewelry account</p>
            </div>

            <form onSubmit={onSubmit} className="auth-form">
              {error && <div className="auth-error">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="username_or_email">Email or Username</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="username_or_email"
                    name="username_or_email"
                    value={username_or_email}
                    onChange={onChange}
                    placeholder="Enter your email or username"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Enter your password"
                    required
                  />
                  <KeyIcon className="input-icon" size={18} />
                </div>
              </div>

              <button 
                type="submit" 
                className="auth-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="auth-links">
                <Link to="/forgot-password" className="forgot-password">
                  Forgot your password?
                </Link>
                <div className="auth-separator">
                  <span>Don't have an account?</span>
                </div>
                <Link to="/register" className="auth-switch-btn">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;