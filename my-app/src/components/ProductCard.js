// jsx
import React from 'react';
import './ProductCard.css'; // Create and style as needed

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={`static/images/product_pics/${product.product_image}`} alt={product.product_name} className="product-image" />
      <h3 className="product-name">{product.product_name}</h3>
      <p className="product-description">{product.product_description}</p>
      <p className="product-price">${product.product_price}</p>
      <button className="buy-button" aria-label={`Buy ${product.product_name}`}>
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;