// src/components/SellerDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SellerDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
    status: 'Available',
    category: '',
    image: null,
  });
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products when the component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/product/seller_all'); // Adjust endpoint if needed
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { image, ...dataWithoutImage } = formData;

    try {
      // Step 1: Send product data as JSON
      const res = await axios.post('/product/add', dataWithoutImage, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const productId = res.data.product_id;

      // Step 2: Upload image separately
      if (image) {
        const imageData = new FormData();
        imageData.append('image', image);

        await axios.post(`/product/${productId}/upload_image`, imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Reset Form
      setFormData({
        name: '',
        price: '',
        description: '',
        quantity: '',
        status: 'Available',
        category: '',
        image: null,
      });
      loadProducts(); // Reload products after adding a new one
    } catch (err) {
      console.error(err);
      setError('Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Seller Dashboard</h2>
      <form onSubmit={handleSubmit}>
        {/* Product Form Fields */}
        <div>
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      
      <h3>Products</h3>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.product_id}>
              <strong>{product.product_name}</strong> - ${product.product_price}
              {/* Add options to update or delete the product */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SellerDashboard;