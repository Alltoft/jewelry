import React from 'react';
import { Share2, ShoppingBag, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard';

const WishlistItem = ({ item, onRemove, onShare }) => (
  <>
    <ProductCard product={item} />
    <div className="wishlist-item-actions">
      <motion.button
        className="wishlist-action primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = `/product/${item.product_id}`}
      >
        <ShoppingBag size={18} />
        View Details
      </motion.button>
      <div className="secondary-actions">
        <motion.button
          className="wishlist-action secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onShare(item)}
        >
          <Share2 size={18} />
        </motion.button>
        <motion.button
          className="wishlist-action secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRemove(item.product_id)}
        >
          <Trash2 size={18} />
        </motion.button>
      </div>
    </div>
  </>
);

export default WishlistItem;