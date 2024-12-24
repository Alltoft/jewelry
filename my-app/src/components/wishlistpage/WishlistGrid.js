import React from 'react';
import { motion } from 'framer-motion';
import WishlistItem from './WishlistItem';

const WishlistGrid = ({ items, onRemove, onShare }) => (
  <div className="wishlist-grid">
    {items.map((item) => (
      <motion.div 
        key={item.product_id}
        className="wishlist-item"
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <WishlistItem 
          item={item}
          onRemove={onRemove}
          onShare={onShare}
        />
      </motion.div>
    ))}
  </div>
);

export default WishlistGrid;