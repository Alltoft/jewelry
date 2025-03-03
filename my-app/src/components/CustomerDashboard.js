import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getCustomerProfile } from '../api';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});

  const loadProfile = async () => {
    try {
      const res = await getCustomerProfile();
      setProfile(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
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
