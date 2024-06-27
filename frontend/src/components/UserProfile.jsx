import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './css/bootstrap.min.css';
import './css/style.css';
import './UserProfile.css';

const UserProfile = ({ username, userEmail, initialFullName }) => {
  const [fullName, setFullName] = useState(initialFullName || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasSubscription, setHasSubscription] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Fetch subscription status from the backend
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch('/api/subscription-status', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHasSubscription(data.hasSubscription);
        } else {
          console.error('Failed to fetch subscription status.');
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ fullName, username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setFullName(data.fullName);
        setMessage('Profile updated successfully!');
      } else {
        const result = await response.json();
        setMessage(result.message || 'Error updating profile.');
        console.error('Error updating profile:', result);
      }
    } catch (error) {
      setMessage('Error updating profile.');
      console.error('Error updating profile:', error);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="content">
      <div className="user-profile form-block">
        <h2>User Profile</h2>
        <div className="user-details">
          <p><strong>Full Name:</strong> {fullName}</p>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {userEmail}</p>
          <p><strong>Subscription:</strong> {hasSubscription ? 'Active' : 'Inactive'}</p>
        </div>
        <form onSubmit={handleUpdate} className="update-form">
          <div className="form-group first position-relative">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-group position-relative">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              readOnly
            />
          </div>
          <div className="form-group position-relative">
            <label htmlFor="password">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility('password')}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="form-group last position-relative">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="password-toggle-icon"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <button type="submit" className="update-button btn btn-pill btn-primary text-white">Update Profile</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default UserProfile;
