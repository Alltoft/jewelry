import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, ShoppingBag, ChevronRight, Minus, Plus, Shield, Package, RefreshCw, Info, Check } from 'lucide-react';
import { getProduct, addToCart, addWishlist } from '../api';
import './ProductDetailsPage.css';
import ReviewStars from './ReviewStars';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [reviews] = useState([]);
  const imageRef = useRef(null);

  const CATEGORY_SIZES = {
    rings: {
      title: 'Ring Size',
      sizes: ['14mm', '14.5mm', '15mm', '15.5mm', '16mm', '16.5mm', '17mm'],
      guide: 'Ring size is measured by inner diameter in millimeters'
    },
    necklaces: {
      title: 'Chain Length',
      sizes: ['40cm', '45cm', '50cm', '55cm', '60cm'],
      guide: 'Necklace length is measured end to end'
    },
    bracelets: {
      title: 'Bracelet Size',
      sizes: ['16cm', '17cm', '18cm', '19cm', '20cm'],
      guide: 'Bracelet size is measured by circumference'
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response)
        console.log('Product:', response);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    // Size validation
    if (!selectedSize && CATEGORY_SIZES[product.data.product_category.toLowerCase()]) {
      showMessage('Please select a size before adding to cart.', 'error');
      return;
    }
  
    try {
      if (localStorage.getItem('token')) {
        await addToCart({ 
          product_id: product.data.product_id,
          quantity,
          size: selectedSize 
        });
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartItem = {
          ...product.data,
          quantity,
          selected_size: selectedSize
        };
        localCart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(localCart));
      }
      showMessage('Added to cart successfully!', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showMessage('Failed to add to cart. Please try again.', 'error');
    }
  };
  
  const showMessage = (message, type) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `cart-message ${type}`;
    messageDiv.innerText = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  };

  const handleWishlist = async () => {
    try {
      if (localStorage.getItem('token')) {
        await addWishlist({ product_id: product.data.product_id });
      } else {
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (!localWishlist.some(item => item.product_id === product.data.product_id)) {
          localWishlist.push(product.data);
          localStorage.setItem('wishlist', JSON.stringify(localWishlist));
        }
      }
      setIsInWishlist(true);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleImageZoom = (e) => {
    if (!imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  if (loading || !product) {
    return <div className="product-details-loading">Loading...</div>;
  }

  const productImages = [
    product.data.product_image,
    ...(product.data.images || []) // Spread additional images from database
  ];

  return (
    <div className="product-details-page">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span>
        <ChevronRight size={16} />
        <span onClick={() => navigate('/store')}>Store</span>
        <ChevronRight size={16} />
        <span className="current">{product.data.product_name}</span>
      </div>

      <div className="product-details-container">
        <div className="product-gallery">
          <div 
            className={`main-image ${isZooming ? 'zooming' : ''}`}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleImageZoom}
          >
            <img 
              ref={imageRef}
              src={`/static/images/product_pics/${productImages[activeImage]}`} 
              alt={product.data.product_name} 
            />
            {isZooming && (
              <div 
                className="zoom-view"
                style={{
                  backgroundImage: `url(/static/images/product_pics/${productImages[activeImage]})`,
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
              />
            )}
          </div>
          <div className="thumbnail-list">
            {productImages.map((image, index) => (
              <div 
                key={index}
                className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img 
                  src={`/static/images/product_pics/${image}`} 
                  alt={`${product.data.product_name} view ${index + 1}`}
                  onError={(e) => {
                    e.target.src = '/static/images/product_pics/default.jpg';
                    console.error(`Failed to load image: ${image}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product.data.product_name}</h1>
            <p className="product-category">In {product.data.product_category}</p>
            <div className="price-container">
              <p className="product-price">${product.data.product_price}</p>
              {product.data.original_price && (
                <p className="original-price">${product.data.original_price}</p>
              )}
            </div>
          </div>

          <div className="product-description">
            <h3>About this piece:</h3>
            <p><h4>{product.data.product_description}</h4></p>
          </div>

          <div className="product-specifications">
            <h3>Specifications</h3>
            <table>
              <tbody>
                <tr>
                  <td>Material:</td>
                  <td>{product.data.product_material}</td>
                </tr>
                {product.data.gemstone && (
                  <tr>
                    <td>Gemstone:</td>
                    <td>{product.data.gemstone}</td>
                  </tr>
                )}
                <tr>
                  <td>Style:</td>
                  <td>{product.data.product_style}</td>
                </tr>
                <tr>
                  <td>Weight:</td>
                  <td>{product.data.weight}g</td>
                </tr>
                {product.data.purity && (
                  <tr>
                    <td>Purity:</td>
                    <td>{product.data.purity}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {product?.data?.product_category && 
           CATEGORY_SIZES[product.data.product_category.toLowerCase()] && (
            <div className="size-selection">
              <div className="size-header">
                <h3>{CATEGORY_SIZES[product.data.product_category.toLowerCase()].title}</h3>
              </div>
              <div className="size-options">
                {CATEGORY_SIZES[product.data.product_category.toLowerCase()].sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-button ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {showSizeGuide && (
                <div className="size-guide-popup">
                  <p>{CATEGORY_SIZES[product.data.product_category.toLowerCase()].guide}</p>
                  <button className="add-to-cart" onClick={() => setShowSizeGuide(false)}>Close</button>
                </div>
              )}
            </div>
          )}

          {/* <div className="quantity-selector">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange('decrease')}>
                <Minus size={20} />
              </button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange('increase')}>
                <Plus size={20} />
              </button>
            </div>
          </div> */}

          {/* <div className="shipping-section">
            <h3>Shipping & Delivery</h3>
            <div className="shipping-options">
              <div className="shipping-option">
                <input type="radio" id="standard" name="shipping" defaultChecked />
                <label htmlFor="standard">
                  <div className="option-content">
                    <div className="option-header">
                      <span className="shipping-name">Standard Shipping</span>
                      <span className="shipping-price">Free</span>
                    </div>
                    <div className="delivery-info">
                      <Package size={16} />
                      <span>Estimated delivery: 5-7 business days</span>
                    </div>
                  </div>
                </label>
              </div>

              <div className="shipping-option">
                <input type="radio" id="express" name="shipping" />
                <label htmlFor="express">
                  <div className="option-content">
                    <div className="option-header">
                      <span className="shipping-name">Express Shipping</span>
                      <span className="shipping-price">$15.00</span>
                    </div>
                    <div className="delivery-info">
                      <Package size={16} />
                      <span>Estimated delivery: 2-3 business days</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div> */}

          {/* <div className="customization-options">
            <h3>Customization Options</h3>
            <button className="customization-button">
              <Info size={20} />
              Add Custom Engraving
            </button>
            <button className="customization-button">
              <Info size={20} />
              Request Size Adjustment
            </button>
          </div> */}

          <div className="purchase-divider">
            <span className="divider-line"></span>
            <span className="divider-text">Handcrafted with excellence</span>
            <span className="divider-line"></span>
          </div>

          <div className="product-actions">
            <button className="add-to-cart" onClick={handleAddToCart}>
              <ShoppingBag size={20} />
              Add to Cart
            </button>
            <button 
              className={`wishlist-button ${isInWishlist ? 'active' : ''}`}
              onClick={handleWishlist}
            >
              {isInWishlist ? <Check size={20} /> : <Heart size={20} />}
            </button>
            <button className="share-button">
              <Share2 size={20} />
            </button>
          </div>

          <div className="product-features">
            <div className="feature">
              <Shield size={24} />
              <div>
                <h4>Secure Payment</h4>
                <p>Your payment information is processed securely</p>
              </div>
            </div>
            <div className="feature">
              <Package size={24} />
              <div>
                <h4>Premium Packaging</h4>
                <p>Each piece comes in a luxury gift box</p>
              </div>
            </div>
            <div className="feature">
              <RefreshCw size={24} />
              <div>
                <h4>30-Day Returns</h4>
                <p>Shop with confidence with our return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <section className="product-reviews">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <div className="average-rating">
            <h3>{product.data.average_rating?.toFixed(1) || 'No ratings'}</h3>
            <ReviewStars rating={product.data.average_rating} />
            <p>{product.data.review_count || 0} reviews</p>
          </div>
        </div>
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <ReviewStars rating={review.rating} />
              <h4>{review.title}</h4>
              <p>{review.content}</p>
              <p className="review-author">
                By {review.author} on {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </section> */}

      {showSizeGuide && (
        <div className="size-guide-modal">
          {/* Add size guide content */}
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;