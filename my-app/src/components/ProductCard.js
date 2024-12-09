import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate(`/product/${product.product_id}`);
  };

  return (
    <div className="product-card">
      <img src={`static/images/product_pics/${product.product_image}`} alt={product.product_name} className="product-image" />
      <h3 className="product-name">{product.product_name}</h3>
      <p className="product-description">{product.product_description}</p>
      <p className="product-price">${product.product_price}</p>
      <button className="buy-button" aria-label={`Buy ${product.product_name}`} onClick={handleBuyNow}>
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;