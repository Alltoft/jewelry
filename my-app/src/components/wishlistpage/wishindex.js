import React from 'react';
import WishlistHeader from './WishlistHeader';
import WishlistGrid from './WishlistGrid';
import WishlistEmpty from './WishlistEmpty';
import useWishlist from './useWishlist';
// import LoadingSpinner from '../common/LoadingSpinner';
import { motion } from 'framer-motion';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlistItems, isLoading, handleRemove, handleShare } = useWishlist();

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

  return (
    <motion.div 
      className="wishlist-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <WishlistHeader itemCount={wishlistItems.length} />
      {wishlistItems.length === 0 ? (
        <WishlistEmpty />
      ) : (
        <WishlistGrid 
          items={wishlistItems}
          onRemove={handleRemove}
          onShare={handleShare}
        />
      )}
    </motion.div>
  );
};

export default WishlistPage;