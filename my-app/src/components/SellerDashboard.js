import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSellerProducts, addProduct, uploadProductImage } from '../api';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
    category: '',
    status: '',
  });
  const [productImage, setProductImage] = useState(null);
  const [message, setMessage] = useState('');

  const productStatuses = ['Available', 'Unavailable']; // Define possible statuses

  const fetchProducts = async () => {
    try {
      const response = await getSellerProducts();
      if (response && response.data) {
        console.log('Fetched products:', response.data); // Log the fetched products
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching seller products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    // Validate quantity
    if (isNaN(newProduct.quantity) || newProduct.quantity <= 0) {
      setMessage('Product quantity must be a positive number');
      return;
    }
    // Validate price
    if (isNaN(newProduct.price) || newProduct.price <= 0) {
      setMessage('Product price must be a positive number');
      return;
    }
    // Validate status
    if (!productStatuses.includes(newProduct.status)) {
      setMessage('Invalid product status');
      return;
    }
    try {
      const response = await addProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity, 10),
        status: newProduct.status,
        category: newProduct.category,
      });
      if (response && response.data) {
        const productId = response.data.product_id;
        if (productId && productImage) {
          const formData = new FormData();
          formData.append('file', productImage);
          await uploadProductImage(productId, formData);
        }
        setMessage('Product added successfully');
        fetchProducts(); // Refresh the product list
        setNewProduct({ name: '', price: '', description: '', quantity: '', category: '', status: '' });
        setProductImage(null);
      } else {
        setMessage('Failed to add product');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred while adding the product');
      }
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <button onClick={goToHome}>Home</button>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          placeholder="Product Name"
        />
        <input
          type="text"
          name="price"
          value={newProduct.price}
          onChange={handleChange}
          placeholder="Product Price"
        />
        <input
          type="text"
          name="description"
          value={newProduct.description}
          onChange={handleChange}
          placeholder="Product Description"
        />
        <input
          type="number"
          name="quantity"
          value={newProduct.quantity}
          onChange={handleChange}
          placeholder="Product Quantity"
        />
        <input
          type="text"
          name="category"
          value={newProduct.category}
          onChange={handleChange}
          placeholder="Product Category"
        />
        <select
          name="status"
          value={newProduct.status}
          onChange={handleChange}
        >
          <option value="">Select Status</option>
          {productStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <input
          type="file"
          name="product_image"
          onChange={handleFileChange}
        />
        <button type="submit">Add Product</button>
      </form>
      <p>{message}</p>
      <h2>Products</h2>
      <ul>
        {products && products.map(product => (
          <li key={product.product_id}>
            {product.product_name || 'No Name'} - {product.product_price || 'No Price'} - {product.product_description || 'No Description'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerDashboard;
