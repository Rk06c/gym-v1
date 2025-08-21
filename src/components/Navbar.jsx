// src/components/Navbar.jsx
import { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="#" className="logo">GYM SYSTEM</a>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`} id="navLinks">
          <a href="#" className="active">Home</a>
          <a href="#">Members</a>
          <a href="#">Contact</a>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;