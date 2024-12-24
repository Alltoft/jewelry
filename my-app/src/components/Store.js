import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getProducts } from '../api';
import ProductCard from './ProductCard';
import FilterPanel from './store/FilterPanel';
import StoreControls from './store/StoreControls';
import { filterProducts, sortProducts } from './utils/filterUtils';
import './Store.css';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    material: '',
    sortBy: 'featured'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      material: '',
      sortBy: 'featured'
    });
    setSearchQuery('');
  };

  const filteredAndSortedProducts = sortProducts(
    filterProducts(products, filters, searchQuery),
    filters.sortBy
  );

  return (
    <div className="store">
      <div className="store-header">
        <h1>Our Collection</h1>
        <p>Discover our curated selection of fine jewelry</p>
      </div>

      <StoreControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={handleFilterChange}
        onToggleFilters={toggleFilters}
      />

      <FilterPanel
        showFilters={showFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onToggleFilters={toggleFilters}
      />

      <div className="active-filters">
        {Object.entries(filters).map(([key, value]) => {
          if (value && value !== 'featured' && value !== 'All' && value !== 'All Materials') {
            return (
              <span key={key} className="filter-tag">
                {value}
                <button onClick={() => handleFilterChange(key, '')}>
                  <X size={14} />
                </button>
              </span>
            );
          }
          return null;
        })}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="results-count">
            Showing {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'item' : 'items'}
          </div>
          <div className="products-grid">
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Store;