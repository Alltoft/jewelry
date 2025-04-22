import React, { useState, useEffect } from 'react';
import NavLinks from './NavLinks';
import MobileNavbar from './MobileNavbar.tsx';
// import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if window is mobile on initial load
    checkIfMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };
  
  return (
    <header className="site-header">
      {isMobile ? <MobileNavbar /> : <NavLinks />}
    </header>
  );
};

export default Navbar;