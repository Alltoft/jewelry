import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, Check } from 'lucide-react';
import { addWishlist } from '../api';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(() => {
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return localWishlist.some(item => item.product_id === product.product_id);
  });

  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const saveToLocalWishlist = (product) => {
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!localWishlist.some(item => item.product_id === product.product_id)) {
      localWishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(localWishlist));
      setIsInWishlist(true);
    }
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    
    try {
      if (isAuthenticated()) {
        await addWishlist({ product_id: product.product_id });
        setIsInWishlist(true);
      } else {
        saveToLocalWishlist(product);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleBuyNow = () => {
    navigate(`/product/${product.product_id}`);
  };

  return (
    <div 
      className="product-card"
    >
      <div className="product-image-container">
        <img 
          src={`static/images/product_pics/${product.product_image}`} 
          alt={product.product_name} 
          className="product-image"
        />
        <div className="product-overlay">
          <button 
            className={`action-button wishlist-button-1 ${isInWishlist ? 'active' : ''}`}
            onClick={handleWishlist}
            aria-label={isInWishlist ? "Added to wishlist" : "Add to wishlist"}
            style={{ display: window.location.pathname === '/wishlist' ? 'none' : 'block' }}
          >
            {isInWishlist ? <Check size={18} /> : <Heart size={18} />}
          </button>
          <button 
            className="action-button view-button"
            onClick={handleBuyNow}
            aria-label="Quick view"
            style={{ display: window.location.pathname === '/wishlist' ? 'none' : 'block' }}
          >
            <Eye size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;