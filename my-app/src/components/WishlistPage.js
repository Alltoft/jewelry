// jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const loadWishlist = async () => {
    try {
      const res = await axios.get('/wishlist');
      setWishlistItems(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <div>
      <h2>Your Wishlist</h2>
      <div className="product-grid">
        {wishlistItems.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
