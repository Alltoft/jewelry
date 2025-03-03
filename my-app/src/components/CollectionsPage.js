import React, { useEffect, useState } from 'react';
import { getProducts } from '../api';
import ProductCard from './ProductCard';
// import './CollectionsPage.css';

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await getProducts();
        setCollections(res.data);
      } catch (err) {
        console.error('Error fetching collections:', err.response?.data || err.message);
      }
    };
    fetchCollections();
  }, []);

  return (
    <div className="collections-page">
      <h1>Our Collections</h1>
      {collections.map((collection) => (
        <section key={collection.id} className="collection-section">
          <h2>{collection.name}</h2>
          <div className="product-grid">
            {collection.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default CollectionsPage;