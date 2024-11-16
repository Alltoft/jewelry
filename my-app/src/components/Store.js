import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api'; // Import the getProducts function
import './Store.css';

const Store = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(); // Use the getProducts function
        console.log('Fetched products:', response.data); // Log the fetched products
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="store-container">
      <header className="store-header">
        <h1>Luxurious Jewelry Store</h1>
        <p>Discover our exquisite collection of fine jewelry.</p>
        <button className="home-button" onClick={goToHome}>Home</button>
      </header>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.product_id} className="product-card">
            <img 
              src={`${product.product_image_url}`} // Prepend the base URL and 'static' directory
              alt={product.product_name} 
              className="product-image" 
            />
            <h2 className="product-name">{product.product_name}</h2>
            <p className="product-description">{product.product_description}</p>
            <p className="product-price">${product.product_price}</p>
            <button className="buy-button">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;