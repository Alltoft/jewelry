import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye} from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate(`/product/${product.product_id}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
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
            className="action-button wishlist-button" 
            onClick={handleWishlist}
            aria-label="Add to wishlist"
          >
            <Heart size={18} />
          </button>
          <button 
            className="action-button view-button"
            onClick={handleBuyNow}
            aria-label="Quick view"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;