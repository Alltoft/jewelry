import React from 'react';
import { Heart, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const WishlistEmpty = () => (
  <div className="wishlist-empty">
    <div className="empty-icon">
      <Heart size={48} />
    </div>
    <h2>Your Collection Awaits</h2>
    <p>Discover our exquisite pieces and create your personal collection</p>
    <motion.button 
      className="explore-button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => window.location.href = '/store'}
    >
      Explore Collections
      <ChevronRight size={20} />
    </motion.button>
  </div>
);

export default WishlistEmpty;