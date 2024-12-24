import React from 'react';
import { X } from 'lucide-react';
import { categories, priceRanges, materials } from '../constants/storeFilters';

const FilterPanel = ({ 
  showFilters, 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onToggleFilters 
}) => {
  return (
    <div className={`filter-panel ${showFilters ? 'show' : ''}`}>
      <div className="filter-header">
        <h3>Filters</h3>
        <button onClick={onClearFilters}>Clear All</button>
        <button className="close-filters" onClick={onToggleFilters}>
          <X size={24} />
        </button>
      </div>

      <div className="filter-groups">
        <div className="filter-group">
          <h4>Categories</h4>
          <div className="filter-options">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-button ${filters.category === category ? 'active' : ''}`}
                onClick={() => onFilterChange('category', category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Price Range</h4>
          <div className="filter-options">
            {priceRanges.map(range => (
              <button
                key={range.value}
                className={`filter-button ${filters.priceRange === range.value ? 'active' : ''}`}
                onClick={() => onFilterChange('priceRange', range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Materials</h4>
          <div className="filter-options">
            {materials.map(material => (
              <button
                key={material}
                className={`filter-button ${filters.material === material ? 'active' : ''}`}
                onClick={() => onFilterChange('material', material)}
              >
                {material}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;