import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './css/bootstrap.min.css';
import './css/style.css';

function Login({ onLoginSuccess }) {
  const [identifierFocused, setIdentifierFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleFocus = (setter) => () => setter(true);
  const handleBlur = (setter, value) => (event) => setter(value !== '' || event.target.value !== '');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const identifier = event.target.identifier.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('http://localhost:5000/login', { identifier, password });
      console.log('Login response:', response.data);
      if (response.data.token && response.data.username) {
        // Store the token and username in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        // Call the onLoginSuccess callback with the token and username
        onLoginSuccess(response.data.token, response.data.username);
        // Redirect to home page
        navigate('/home');
      } else {
        // If the response does not contain both token and username, show error
        setErrorMessage('Invalid response from server');
      }
    } catch (error) {
      console.error('Error logging in:', error.response ? error.response.data : error.message);
      setErrorMessage('Invalid username/email or password');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
                    <h4>Welcome Back!</h4>
                    <h4>Login to your account</h4>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className={`form-group first ${identifierFocused ? 'focused' : ''}`}>
                      <label htmlFor="identifier">Email/Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="identifier"
                        name="identifier"
                        onFocus={handleFocus(setIdentifierFocused)}
                        onBlur={handleBlur(setIdentifierFocused, '')}
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
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="control control--checkbox">
                        <input
                          type="checkbox"
                          id="remember-me"
                          defaultChecked={true}
                        />
                        <label htmlFor="remember-me" className="caption">Remember me</label>
                        <div className="control__indicator"></div>
                      </div>
                      <span>
                        <Link to="/forgot" className="forgot-pass">Forgot Password</Link>
                      </span>
                    </div>
                    <input
                      type="submit"
                      value="Log In"
                      className="btn btn-pill text-white btn-block btn-primary"
                    />
                  </form>
                  <br></br>
                  <div className="mb-3 text-center">
                    <span>Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link></span>
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

export default Login;
