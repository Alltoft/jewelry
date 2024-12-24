import React from 'react';
import { Heart } from 'lucide-react';

const WishlistHeader = ({ itemCount }) => {
  const token = localStorage.getItem('token');

  return (
  <div className="wishlist-header">
    {!token && (
    <p className="wishlist-subtitle">
    Items saved while not logged in are temporary and device-specific. Please log in to save items permanently to your collection.
    </p>
    )}
    <div className="wishlist-title">
      <Heart size={24} />
      <h1>My Curated Collection</h1>
    </div>
    <p className="wishlist-subtitle">
      {itemCount} {itemCount === 1 ? 'piece' : 'pieces'} in your collection
    </p>
  </div>
  );
};

export default WishlistHeader;