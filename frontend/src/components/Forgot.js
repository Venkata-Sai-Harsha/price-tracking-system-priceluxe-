import React from 'react';
import './css/bootstrap.min.css';
import './css/style.css';

const ForgotPassword = () => {
  return (
    <div className="content">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 contents">
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="form-block">
                  <div className="mb-4">
                    <h4>Forgot Password?</h4>
                  </div>
                  <form action="#" method="post">
                    <div className="form-group first">
                      <label htmlFor="email">Email</label>
                      <input type="email" className="form-control" id="email" />
                    </div>
                    <input
                      type="submit"
                      value="Send Reset Link"
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
};

export default ForgotPassword;
