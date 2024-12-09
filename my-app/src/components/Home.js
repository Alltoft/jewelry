import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NavLinks from './NavLinks';
import ProductCard from './ProductCard';
import { getProducts } from '../api'; // Ensure this API function exists
import './Home.css';
import Loading from './Loading'; // Import the Loading component

const Home = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Exquisite Jewelry for Every Occasion</h1>
        </div>
      </section>
      <h2>Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;