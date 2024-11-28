// src/components/SellerDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from './Loading';
import ProductCard from './ProductCard'; // Import ProductCard
import './SellerDashboard.css';

const SellerDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    quantity: '',
    status: 'Available',
    category: '',
    image: null, // Main image file
    additionalImages: [], // Array of image URLs
  });

  const [selectedAdditionalImage, setSelectedAdditionalImage] = useState(null); // Currently selected additional image file
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingAdditionalImage, setUploadingAdditionalImage] = useState(false);
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false); // New state
  const [uploadingImage, setUploadingImage] = useState(false); // Added state for uploading image

  // Fetch products when the component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/products'); // Adjust the endpoint as needed
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleAdditionalImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedAdditionalImage(file);
  };

  const handleAddAdditionalImage = async () => {
    if (!selectedAdditionalImage) {
      alert('Please select an image to add.');
      return;
    }

    setUploadingImage(true); // Use the correct setter
    setError(null);

    const imageData = new FormData();
    imageData.append('image', selectedAdditionalImage);

    try {
      const res = await axios.post('/upload_temp_image', imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming the backend returns the full URL
      setFormData((prevData) => ({
        ...prevData,
        additionalImages: [...prevData.additionalImages, res.data.image_url],
      }));

      alert('Image uploaded successfully. You can add another image or submit the form.');
      setSelectedAdditionalImage(null);
      // Clear the file input
      document.getElementById('additionalImages').value = '';
    } catch (err) {
      console.error(err);
      setError('Failed to upload additional image.');
    } finally {
      setUploadingImage(false); // Use the correct setter
    }
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === 'additionalImages') {
      if (files.length > 0) {
        const file = files[0];
        setUploadingImage(true);
        try {
          const imageData = new FormData();
          imageData.append('image', file);

          const res = await axios.post('/upload_temp_image', imageData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Assuming the backend returns the filename or URL
          setFormData((prevData) => ({
            ...prevData,
            additionalImages: [...prevData.additionalImages, res.data.image_url],
          }));

          alert('Image uploaded successfully. You can add another image or submit the form.');
        } catch (err) {
          console.error(err);
          setError('Failed to upload additional image.');
        } finally {
          setUploadingImage(false);
        }
      }
    } else if (name === 'image') {
      console.log('Selected main image:', files[0]);
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { image, additionalImages, ...dataWithoutImages } = formData;

    console.log('Submitting product data:', dataWithoutImages);
    console.log('Main image:', image);
    console.log('Additional images:', additionalImages);

    try {
      // Step 1: Send product data as JSON
      const res = await axios.post('/product/add', dataWithoutImages, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const productId = res.data.product_id;

      // Step 2: Upload main image
      if (image) {
        const imageData = new FormData();
        imageData.append('image', image);

        await axios.post(`/product/${productId}/upload_image`, imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Step 3: Associate additional images
      if (additionalImages.length > 0) {
        const additionalImageData = new FormData();
        additionalImages.forEach((image_url) => {
          additionalImageData.append('images', image_url);
        });

        await axios.post(`/product/${productId}/associate_images`, additionalImageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Reset Form and Close Modal
      setFormData({
        name: '',
        price: '',
        description: '',
        quantity: '',
        status: 'Available',
        category: '',
        image: null,
        additionalImages: [],
      });
      setShowAddProduct(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      setError('Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-dashboard-container">
      <h2>Seller Dashboard</h2>
      <button className="add-product-button" onClick={() => setShowAddProduct(true)}>
        Add Product
      </button>

      {showAddProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close-button" onClick={() => setShowAddProduct(false)}>&times;</span>
            <h3>Add New Product</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
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
              
              <div className="form-group">
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
              
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
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
              
              <div className="form-group">
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
              
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Rings">Rings</option>
                  <option value="Necklaces">Necklaces</option>
                  <option value="Bracelets">Bracelets</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Watches">Watches</option>
                  <option value="Brooches">Brooches</option>
                  <option value="Anklets">Anklets</option>
                  <option value="Cufflinks">Cufflinks</option>
                  <option value="Pendants">Pendants</option>
                  <option value="Charms">Charms</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Image:</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleMainImageChange}
                  accept="image/*"
                  required
                />
                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Main Preview"
                    width="100"
                  />
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="additionalImages">Additional Images:</label>
                <input
                  type="file"
                  id="additionalImages"
                  name="additionalImages"
                  onChange={handleAdditionalImageChange}
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={handleAddAdditionalImage}
                  disabled={uploadingImage || !selectedAdditionalImage}
                >
                  {uploadingImage ? 'Uploading...' : 'Add Image'}
                </button>
                {error && <p className="error-message">{error}</p>}
                {formData.additionalImages.length > 0 && (
                  <ul>
                    {formData.additionalImages.map((img, index) => (
                      <li key={index}>
                        <img src={img} alt={`Additional ${index + 1}`} width="100" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
              </button>
              
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>
      )}

      <h3>Products</h3>
      {loading ? (
        <Loading />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;