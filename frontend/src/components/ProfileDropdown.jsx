import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ProfileDropdown.css'; // Ensure you have the CSS file for styling

const ProfileDropdown = ({ username, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <div className="profile-dropdown">
      <div className="profile" onClick={handleProfileClick}>
        <span className="profile-symbol">👤</span>
        <span className="username">{username}</span>
        <span className="dropdown-arrow">▼</span>
      </div>
      {isOpen && (
        <div className="dropdown-content">
          <Link to="/userprofile" onClick={() => setIsOpen(false)}>
            <span className="dropdown-symbol"></span> UserProfile
          </Link>
          <Link to="/subscribe" onClick={() => setIsOpen(false)}>
            <span className="dropdown-symbol"></span> Subscription
          </Link>
          <a href="#" onClick={handleLogout}>
            <span className="dropdown-symbol"></span> Logout
          </a>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
