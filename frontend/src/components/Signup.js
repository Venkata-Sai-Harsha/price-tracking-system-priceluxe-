import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './css/bootstrap.min.css';
import './css/style.css';

function Signup({ onSignupSuccess }) {
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFocus = (setter) => () => setter(true);
  const handleBlur = (setter, value) => (event) => setter(value !== '' || event.target.value !== '');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target['confirm-password'].value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password,
      });

      if (response.data.token && response.data.username) {
        // Store the token and username in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.username); // Corrected to 'userName'
        // Call the onSignupSuccess callback
        onSignupSuccess(response.data.token, response.data.username);
        // Redirect to home page
        navigate('/home');
      }
    } catch (error) {
      setError('Error signing up. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="content">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 contents">
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="form-block">
                  <div className="mb-4">
                    <h4>Create an Account</h4>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className={`form-group first ${usernameFocused ? 'focused' : ''}`}>
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        onFocus={handleFocus(setUsernameFocused)}
                        onBlur={handleBlur(setUsernameFocused, '')}
                        required
                      />
                    </div>
                    <div className={`form-group first ${emailFocused ? 'focused' : ''}`}>
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        onFocus={handleFocus(setEmailFocused)}
                        onBlur={handleBlur(setEmailFocused, '')}
                        required
                      />
                    </div>
                    <div className={`form-group last mb-4 ${passwordFocused ? 'focused' : ''}`}>
                      <label htmlFor="password">Password</label>
                      <div className="position-relative">
                        <input
                          type={passwordVisible ? "text" : "password"}
                          className="form-control"
                          id="password"
                          name="password"
                          onFocus={handleFocus(setPasswordFocused)}
                          onBlur={handleBlur(setPasswordFocused, '')}
                          required
                        />
                        <span
                          className="password-toggle-icon"
                          onClick={togglePasswordVisibility}
                        >
                          <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                        </span>
                      </div>
                    </div>
                    <div className={`form-group last mb-4 ${confirmPasswordFocused ? 'focused' : ''}`}>
                      <label htmlFor="confirm-password">Confirm Password</label>
                      <div className="position-relative">
                        <input
                          type={confirmPasswordVisible ? "text" : "password"}
                          className="form-control"
                          id="confirm-password"
                          name="confirm-password"
                          onFocus={handleFocus(setConfirmPasswordFocused)}
                          onBlur={handleBlur(setConfirmPasswordFocused, '')}
                          required
                        />
                        <span
                          className="password-toggle-icon"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} />
                        </span>
                      </div>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <input
                      type="submit"
                      value="Sign Up"
                      className="btn btn-pill text-white btn-block btn-primary"
                    />
                  </form>
                  <br />
                  <div className="mb-3 text-center">
                    <span>
                      Already have an account?{' '}
                      <Link to="/login" className="login-link">
                        Log In
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
