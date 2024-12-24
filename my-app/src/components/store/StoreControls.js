import React from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { sortOptions } from '../constants/storeFilters';

const StoreControls = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  onToggleFilters 
}) => {
  return (
    <div className="store-controls">
      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search our collection..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <button 
        className="filter-toggle"
        onClick={onToggleFilters}
      >
        <SlidersHorizontal size={20} />
        Filters
      </button>

      <div className="sort-dropdown">
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={20} />
      </div>
    </div>
  );
};

export default StoreControls;