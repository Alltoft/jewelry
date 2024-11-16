import React from 'react';

const FilterOptions = ({ filter, setFilter }) => {
  return (
    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
      <option value="">All</option>
      <option value="Available">Available</option>
      <option value="Unavailable">Unavailable</option>
    </select>
  );
};

export default FilterOptions;
