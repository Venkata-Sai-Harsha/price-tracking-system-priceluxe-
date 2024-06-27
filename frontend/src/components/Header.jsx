import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown'; // Import the ProfileDropdown component
import '../App.css';

const Header = ({ isAuthenticated, userName, onLogout }) => {
  const toggleMenu = () => {
    document.querySelector('.navlist').classList.toggle('open');
  };

  return (
    <header>
      <div className="header-content">
        <Link to="/home" className="logo"><span>P</span>rice<span>L</span>uxe</Link>
        <ul className="navlist">
          <li><Link to="/home" style={{ "--i": 1 }}>Home</Link></li>
          {/* <li><Link to="/subscribe" style={{ "--i": 2 }}>Subscribe</Link></li> */}
          <li><Link to="/deals" style={{ "--i": 3 }}>Deals</Link></li> {/* Add the Deals link */}
          <li><Link to="/service" style={{ "--i": 8 }}>Service</Link></li>
          <li><Link to="/about" style={{ "--i": 4 }}>About</Link></li>
          {!isAuthenticated && <li><Link to="/signup" style={{ "--i": 6 }}>Signup</Link></li>}
          {!isAuthenticated && <li><Link to="/login" style={{ "--i": 7 }}>Login</Link></li>}
          {isAuthenticated && <li><ProfileDropdown username={userName} onLogout={onLogout} /></li>}
        </ul>
      </div>
      <div id="menu-icon" className="bx bx-menu" onClick={toggleMenu}></div>
    </header>
  );
};

export default Header;
