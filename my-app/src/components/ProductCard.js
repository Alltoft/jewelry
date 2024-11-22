// jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product.product_id}`}>
        <img src={product.product_image_url} alt={product.product_name} />
        <h3>{product.product_name}</h3>
        <p>${product.product_price}</p>
      </Link>
    </div>
  );
};

export default ProductCard;