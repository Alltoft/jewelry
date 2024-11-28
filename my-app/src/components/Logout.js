import React from 'react';
import { logoutUser } from '../api';

const Logout = ({ onLogout, className }) => {
  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      Logout
    </button>
  );
};

export default Logout;
