import React from 'react';
import AddressSearch from '../components/AddressSearch';

const TestAddress = () => {
  const handleAddressSelect = (address) => {
    console.log('Selected Address:', address);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Test Address Search</h1>
      <AddressSearch onAddressSelect={handleAddressSelect} />
    </div>
  );
};

export default TestAddress;