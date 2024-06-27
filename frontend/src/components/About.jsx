import React from 'react';
import './About.css';
import teamImage from './images/team.jpg'; // Ensure the image path is correct
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const AboutPage = () => {
    return (
        <div>
            <h1 className="about-title">About</h1>
            <div className="vision-section">
                <h2 className="vision-title">Our Vision</h2>
                <p className="vision-text">
                    At Priceluxe, our vision is to revolutionize the way consumers track and compare prices across various e-commerce platforms. We aim to empower shoppers with real-time data, helping them make informed purchasing decisions.
                </p>
                <p>Let's talk</p>
                <a href="mailto:info@priceluxe.com">info@priceluxe.com</a>
            </div>
            <div className="team-story-section about-feature-section">
                <div className="about-feature-image">
                    <img src={teamImage} alt="Team" className="team-image" />
                </div>
                <div className="about-feature-text">
                    <h2 className="team-title">Team Story</h2>
                    <p className="team-text">
                        Our team started as a small group of passionate developers who saw a need for better price tracking tools. Over time, we have grown into a dedicated team of experts in web scraping, data analysis, and software development, all working together to create a seamless and efficient price tracking system.
                    </p>
                </div>
            </div>
            <div className="contact-section">
                <h2>Contact Us</h2>
                <p>If you have any questions, feel free to reach out to us!</p>
                <Link to="/contact" className="contact-button">Contact Team</Link>
            </div>
        </div>
    );
}

export default AboutPage;
