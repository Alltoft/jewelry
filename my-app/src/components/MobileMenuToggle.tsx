import React from 'react';
import './MobileMenuToggle.css';

interface MobileMenuToggleProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ isOpen, toggleMenu }) => {
  return (
    <div className="mobile-menu-toggle">
      <label className="burger" htmlFor="burger">
        <input 
          type="checkbox" 
          id="burger" 
          checked={isOpen} 
          onChange={toggleMenu} 
        />
        <span></span>
        <span></span>
        <span></span>
      </label>
    </div>
  );
};

export default MobileMenuToggle;