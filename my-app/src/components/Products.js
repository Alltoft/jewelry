// src/components/Products.js
import React, { useEffect, useState } from 'react';
import { getProducts } from '../api';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.product_id}>
            <h3>{product.product_name}</h3>
            <p>{product.product_description}</p>
            <p>Price: ${product.product_price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
