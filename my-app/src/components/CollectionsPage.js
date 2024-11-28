// jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
// import './CollectionsPage.css';

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get('/api/collections');
        setCollections(res.data);
      } catch (err) {
        console.error(err);
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