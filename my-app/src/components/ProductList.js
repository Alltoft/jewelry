import React from 'react';

const ProductList = ({ products }) => {
  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product.product_id} className="product-item">
          <h3>{product.product_name}</h3>
          <p>{product.product_description}</p>
          <p>Price: ${product.product_price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
