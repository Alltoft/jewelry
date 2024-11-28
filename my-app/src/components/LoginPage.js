import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username_or_email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const { username_or_email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', {
        username: username_or_email,
        email: username_or_email,
        password,
      });
      setUser(res.data);
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response.data.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        name="username_or_email"
        value={username_or_email}
        onChange={onChange}
        placeholder="Username or Email"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
