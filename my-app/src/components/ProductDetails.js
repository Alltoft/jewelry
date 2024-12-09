import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';
import ColorThief from 'colorthief';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  // State Management
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Refs
  const imgRef = useRef(null);
  const lensRef = useRef(null);
  
  // Constants
  const zoomLevel = 2;

  // Effects
  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (currentImage) {
      extractColors();
    }
  }, [currentImage]);

  useEffect(() => {
    if (product) {
      // Set the initial main image if not already set
      if (!currentImage) {
        setCurrentImage(product.images[0]);
      }

      // Optionally, ensure currentImage is part of product.images
      if (!product.images.includes(currentImage)) {
        setProduct(prevProduct => ({
          ...prevProduct,
          images: [currentImage, ...prevProduct.images],
        }));
      }
    }
  }, [product, currentImage]);

  // Load Product Data
  const loadProduct = async () => {
    try {
      const res = await axios.get(`/product/${id}`);
      setProduct(res.data);
      setCurrentImage(res.data.product_image);
      checkWishlistStatus(res.data.product_id);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Check Wishlist Status
  const checkWishlistStatus = async (productId) => {
    if (user && user.role === 'Customer') {
      try {
        const wishlistRes = await axios.get('/wishlist');
        setIsWishlisted(wishlistRes.data.some(item => item.product_id === productId));
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    } else {
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist')) || [];
      setIsWishlisted(guestWishlist.some(item => item.product_id === productId));
    }
  };

  // Theme Application
  const applyTheme = (colors) => {
    const [primaryColor, secondaryColor] = colors;
    document.documentElement.style.setProperty('--primary-color', `rgb(${primaryColor.join(',')})`);
    document.documentElement.style.setProperty('--secondary-color', `rgb(${secondaryColor.join(',')})`);
  };

  // Extract Colors from Image
  const extractColors = () => {
    const img = imgRef.current;
    const colorThief = new ColorThief();
    if (img.complete) {
      const colors = colorThief.getPalette(img, 2);
      applyTheme(colors);
    } else {
      img.addEventListener('load', () => {
        const colors = colorThief.getPalette(img, 2);
        applyTheme(colors);
      });
    }
  };

  // Quantity Validation
  const validateQuantity = (value) => {
    if (value < 1) {
      setQuantityError('Quantity must be at least 1.');
      return false;
    }
    // Additional validations (e.g., max stock) can be added here
    setQuantityError('');
    return true;
  };

  // Handle Quantity Change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
    validateQuantity(value);
  };

  // Add to Cart
  const addToCart = async () => {
    if (!validateQuantity(quantity)) return;

    if (user && user.role === 'Customer') {
      try {
        await axios.post('/cart/add', { product_id: product.product_id, quantity });
        alert('Item added to cart!');
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    } else {
      handleGuestCart();
    }
  };

  // Handle Guest Cart Operations
  const handleGuestCart = () => {
    const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
    const existingItem = guestCart.find(item => item.product_id === product.product_id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      guestCart.push({ product_id: product.product_id, quantity });
    }
    
    localStorage.setItem('guestCart', JSON.stringify(guestCart));
    alert('Item added to cart!');
  };

  // Add to Wishlist
  const addToWishlist = async () => {
    if (user && user.role === 'Customer') {
      handleAuthenticatedWishlist();
    } else {
      handleGuestWishlist();
    }
  };

  // Handle Authenticated Wishlist Operations
  const handleAuthenticatedWishlist = async () => {
    try {
      if (isWishlisted) {
        await axios.post('/wishlist/remove', { product_id: product.product_id });
        setIsWishlisted(false);
        alert('Removed from wishlist.');
      } else {
        await axios.post('/wishlist/add', { product_id: product.product_id });
        setIsWishlisted(true);
        alert('Added to wishlist!');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // Handle Guest Wishlist Operations
  const handleGuestWishlist = () => {
    const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist')) || [];
    if (isWishlisted) {
      const updatedWishlist = guestWishlist.filter(item => item.product_id !== product.product_id);
      localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
      alert('Removed from wishlist.');
    } else {
      guestWishlist.push({ product_id: product.product_id });
      localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
      setIsWishlisted(true);
      alert('Added to wishlist!');
    }
  };

  // Handle Thumbnail Click to set main image
  const handleThumbnailClick = (image) => {
    setCurrentImage(image);
  };

  // Handle Mouse Movement for Magnifier Lens
  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const lens = lensRef.current;
    if (!img || !lens) return;

    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > img.width || y > img.height) {
      lens.style.display = 'none';
      return;
    }

    lens.style.display = 'block';

    const lensWidth = lens.offsetWidth;
    const lensHeight = lens.offsetHeight;

    let posX = x - lensWidth / 2;
    let posY = y - lensHeight / 2;

    posX = Math.max(0, Math.min(posX, img.width - lensWidth));
    posY = Math.max(0, Math.min(posY, img.height - lensHeight));

    lens.style.left = `${posX}px`;
    lens.style.top = `${posY}px`;

    const bgWidth = img.width * zoomLevel;
    const bgHeight = img.height * zoomLevel;
    lens.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;

    const bgPosX = -(posX * zoomLevel);
    const bgPosY = -(posY * zoomLevel);
    lens.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  };

  // Handle Mouse Enter for Magnifier Lens
  const handleMouseEnter = () => {
    lensRef.current.style.display = 'block';
  };

  // Handle Mouse Leave for Magnifier Lens
  const handleMouseLeave = () => {
    lensRef.current.style.display = 'none';
  };

  if (!product) return <Loading />;

  return (
    <div className="product-details">
      <div className="product-images">
        <div
          className="main-image-container"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={`/static/images/product_pics/${currentImage}`}
            alt={product.product_name}
            className="main-image"
            ref={imgRef}
          />
          <div
            className="magnifier-lens"
            ref={lensRef}
            style={{
              backgroundImage: `url(/static/images/product_pics/${currentImage})`,
              backgroundRepeat: 'no-repeat',
            }}
          ></div>
        </div>
        <div className="thumbnail-container">
          {product.images?.map((image, index) => (
            <img
              key={index}
              src={`/static/images/product_pics/${image}`}
              alt={`${product.product_name} ${index + 1}`}
              className={`thumbnail-image ${image === currentImage ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(image)}
            />
          ))}
        </div>
      </div>
      <div className="product-info">
        <h2>{product.product_name}</h2>
        <p className="product-description">{product.product_description}</p>
        <p className="product-price">${product.product_price}</p>
        
        <div className="quantity-selector">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            step="1"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>
        {quantityError && <p className="error">{quantityError}</p>}
        
        <button
          className="add-to-cart"
          onClick={addToCart}
          disabled={quantityError !== ''}
        >
          Add to Cart
        </button>
        
        <button
          className={`add-to-wishlist ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={addToWishlist}
        >
          {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </button>
        
        {/* Reviews Section */}
      </div>
    </div>
  );
};

export default ProductDetails;