import { useState, useEffect } from 'react';
import { getWishlist, removeWishlist } from '../../api';

const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Authenticated user - fetch from API
          const response = await getWishlist();
          setWishlistItems(response.data);
        } else {
          // Non-authenticated user - get from localStorage
          const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
          setWishlistItems(localWishlist);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        // Fallback to local storage on error
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistItems(localWishlist);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        // Authenticated user - remove from API
        await removeWishlist({ product_id: productId });
      } else {
        // Non-authenticated user - remove from localStorage
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const updatedWishlist = localWishlist.filter(item => item.product_id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      }
      
      // Update state in both cases
      setWishlistItems(items => items.filter(item => item.product_id !== productId));
      } catch (error) {
        console.error('Error removing item:', error);
    }
  };

  const handleShare = async (product) => {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out this beautiful piece: ${product.name}`,
        url: `${window.location.origin}/product/${product.product_id}`
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return {
    wishlistItems,
    isLoading,
    handleRemove,
    handleShare
  };
};

export default useWishlist;