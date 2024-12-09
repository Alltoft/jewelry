import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProductCard from './ProductCard';
import './WishlistPage.css';

const WishlistPage = () => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load Wishlist Items
  const loadWishlist = async () => {
    if (user && user.role === 'Customer') {
      try {
        const res = await axios.get('/wishlist');
        setWishlistItems(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    } else {
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist')) || [];
      setWishlistItems(guestWishlist);
    }
  };

  useEffect(() => {
    loadWishlist();
    // eslint-disable-next-line
  }, [user]);

  // Remove Item from Wishlist
  const removeFromWishlist = async (productId) => {
    if (user && user.role === 'Customer') {
      try {
        await axios.post('/wishlist/remove', { product_id: productId });
        setWishlistItems(wishlistItems.filter(item => item.product_id !== productId));
        alert('Removed from wishlist.');
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    } else {
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist')) || [];
      const updatedWishlist = guestWishlist.filter(item => item.product_id !== productId);
      localStorage.setItem('guestWishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      alert('Removed from wishlist.');
    }
  };

  // Add Item to Cart
  const addToCart = async (product) => {
    const { product_id, quantity = 1 } = product;
    if (user && user.role === 'Customer') {
      try {
        await axios.post('/cart/add', { product_id, quantity });
        alert('Item added to cart!');
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const existingItem = guestCart.find(item => item.product_id === product_id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        guestCart.push({ product_id, quantity });
      }
      
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      alert('Item added to cart!');
    }
  };

  return (
    <div className="wishlist-page">
      <h2>Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="product-grid">
          {wishlistItems.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onRemove={() => removeFromWishlist(product.product_id)}
              onAddToCart={() => addToCart(product)}
              isWishlisted={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
