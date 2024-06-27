import React from 'react';
import './Contact.css'; // Import this CSS file for styling if needed

const Contact = () => {
    return (
        <div className="contact-page-container">
            <div className="contact-description">
                <h1>Contact Us</h1>
                <p>Thank you for your interest in priceluxe. We are committed to providing you with the best possible service and support. 
                    If you have any questions about our products or services, please do not hesitate to contact us. Our team of experts is always ready to assist you with any inquiries you may have.
                    You can reach us by phone, email or by filling out our contact form. We look forward to hearing from you!</p>
            </div>
            <div className="contact-form-section">
                <br></br>
                <form className="contact-form">
                    <label htmlFor="name" className="contact-form-label">Name:</label>
                    <input type="text" id="name" name="name" className="contact-form-input" required />

                    <label htmlFor="email" className="contact-form-label">Email:</label>
                    <input type="email" id="email" name="email" className="contact-form-input" required />

                    <label htmlFor="message" className="contact-form-label">Message:</label>
                    <textarea id="message" name="message" className="contact-form-textarea" rows="4" required></textarea>

                    <button type="submit" className="contact-form-button">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
