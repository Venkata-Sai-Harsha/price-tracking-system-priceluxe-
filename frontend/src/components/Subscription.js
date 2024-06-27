import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/style.css';
import './Subscription.css'

function Subscription() {
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate email, product, and card details
    if (!email || !cardNumber || !expiryDate || !cvv) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      // Send subscription data to the backend
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, cardNumber, expiryDate, cvv }),
      });

      if (response.ok) {
        setMessage('Subscription successful!');
        setEmail('');
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        // Optionally redirect to another page
        navigate('/home');
      } else {
        setMessage('Subscription failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
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
                    <h4>Subscribe for Price Updates</h4>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group first">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input
                        type="text"
                        className="form-control"
                        id="expiryDate"
                        name="expiryDate"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group last">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cvv"
                        name="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                      />
                    </div>
                    {message && <div className="alert alert-danger mt-3 text-center">{message}</div>}
                    <input
                      type="submit"
                      value="Subscribe"
                      className="btn btn-pill text-white btn-block btn-primary"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
