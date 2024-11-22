// jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});

  const loadProfile = async () => {
    try {
      const res = await axios.get('/costumer/profile');
      setProfile(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  useEffect(() => {
    if (user && user.role === 'Customer') {
      loadProfile();
    }
  }, [user]);

  return (
    <div>
      <h2>Customer Dashboard</h2>
      {/* Display and update customer profile information */}
    </div>
  );
};

export default CustomerDashboard;
