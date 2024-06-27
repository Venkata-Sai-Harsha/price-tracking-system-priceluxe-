import React from 'react';
import './Service.css';
import scrapImage from './images/scrap.webp';
import prod from './images/product.webp'; 
import track from './images/tracking.jpg';
import sub from './images/sub.jpg';

const Service = () => {
    return (
        <div className="about-section">
            <h1 className="about-title">Service</h1>
            <p>Track products across multiple e-commerce websites, manage product reviews, and enjoy our subscription plans for enhanced features.</p>

            <div className="services-section">
                <h1>Services We Provide</h1>
                <br></br>
                <div className="service-grid">
                    <div className="service-detail">
                        <h3>Price Monitoring</h3>
                        <p>We provide real-time price monitoring for your products across all major e-commerce websites, giving you an edge in the competitive online market.</p>
                    </div>

                    <div className="service-detail">
                        <h3>Web Scraping</h3>
                        <p>Our web scraping technology collects and analyzes data from across the web, providing you with valuable insights into your competitors’ pricing strategies, consumer behavior, and market trends.</p>
                    </div>

                    <div className="service-detail">
                        <h3>Product Review Management</h3>
                        <p>Our product review management services help you monitor and respond to customer reviews, improving your online reputation and boosting customer satisfaction.</p>
                    </div>

                    <div className="service-detail">
                        <h3>Subscription</h3>
                        <p>Access our e-commerce analytics services for invaluable insights into customer behavior, empowering data-driven decisions that fuel growth and enhance customer satisfaction.</p>
                    </div>
                </div>
            </div>

            <div className="feature-section">
                <div className="feature-image">
                    <img src={track} alt="Track Products" />
                </div>
                <div className="feature-text">
                    <h2 className='harsha'>Price Monitoring</h2>
                    <p>At Priceluxe, we understand the challenges of navigating the ever-changing landscape of e-commerce pricing. To help you stay competitive, we offer real-time price monitoring services across all major e-commerce platforms. Leveraging our state-of-the-art technology, you can maintain a strategic edge by making informed pricing decisions swiftly.
Our price monitoring service is designed to give you a decisive advantage in the online marketplace. Using advanced web scraping technology, we gather data on your product prices from leading e-commerce websites. This information is then meticulously analyzed and presented in a user-friendly format, enabling you to quickly adjust your pricing strategy based on the latest market trends.
We tailor our services to fit your unique business requirements. Whether you need daily, weekly, or monthly price monitoring reports, we provide timely and accurate data to keep you informed about your competitors’ pricing moves. This allows you to adapt your strategy effectively and maintain your market position.
At Priceluxe, we believe that effective price monitoring goes beyond merely tracking prices. It involves a deep understanding of your competitors' pricing strategies and consumer behavior. Our team of experts offers insights into these areas, helping you make data-driven decisions that foster growth and enhance your competitive edge.</p>
                </div>
            </div>

            <div className="feature-section feature-left">
                <div className="feature-image">
                    <img src={scrapImage} alt="Web Scraping" />
                </div>
                <div className="feature-text">
                    <h2 className='harsha'>Web Scraping</h2>
                    <p>In today’s digital landscape, data is the cornerstone of effective decision-making. At Priceluxe, we specialize in web scraping, a powerful method for gathering and analyzing online data. Our technology delivers crucial insights into your competitors’ pricing tactics, consumer behaviors, and market trends, giving you a strategic advantage in the competitive e-commerce arena.
Our cutting-edge web scraping technology is engineered to swiftly and accurately harvest vast amounts of data from the internet. By deploying sophisticated algorithms, we systematically crawl websites to collect information on your products, competitors, and industry trends. This data is then processed and presented in an intuitive format, empowering you to make data-driven decisions that fuel your business growth.
Our web scraping services are highly adaptable to suit your specific business requirements. We can gather comprehensive data on product prices, customer ratings, reviews, and more. Whether your goal is to monitor competitor pricing or gain deeper insights into consumer behavior, our services equip you with the critical information needed for success.
At Priceluxe, we believe that the true value of web scraping lies not just in data collection, but in transforming that data into actionable insights. Our expert team provides detailed analyses of competitor pricing strategies, consumer behavior patterns, and market dynamics, helping you make informed decisions that enhance growth and maintain your competitive edge.</p>
                </div>
            </div>

            <div className="feature-section">
                <div className="feature-image">
                    <img src={prod} alt="Product Review Management" />
                </div>
                <div className="feature-text">
                    <h2 className='harsha'>Product Review Management</h2>
                    <p>In the competitive e-commerce landscape, online reviews can significantly impact your business’s success. At Priceluxe, we provide comprehensive product review management services designed to help you monitor and respond to customer feedback effectively, enhancing your online reputation and increasing customer satisfaction.
Our review management services keep you at the forefront of your online presence. We track reviews across all major e-commerce sites and social media platforms, offering real-time alerts and insights into customer opinions. Our expert team assists you in crafting professional, timely, and effective responses, which not only enhance your reputation but also improve overall customer satisfaction.
We tailor our review management services to meet your unique business requirements. Whether your goal is to strengthen your online reputation or elevate customer satisfaction, we collaborate with you to develop strategies that align with your business objectives.
At Priceluxe, we view product review management as more than just monitoring and replying to feedback. We leverage customer insights to identify opportunities for improving your products and services. Our experts analyze customer feedback to uncover areas for enhancement, guiding you towards decisions that drive growth and bolster customer satisfaction.</p>
                </div>
            </div>

            <div className="feature-section feature-left">
                <div className="feature-image">
                    <img src={sub} alt="Subscription" />
                </div>
                <div className="feature-text">
                    <h2 className='harsha'>Subscription Plans</h2>
                    <p>In the fast-paced world of e-commerce, having a competitive edge is crucial. At Priceluxe, our subscription plans offer you the ability to track products across multiple e-commerce platforms, beyond the basic Amazon tracking available to non-subscribers. For just $100 per month or $1100 per year, 
                        our subscribers gain access to advanced features like real-time alerts for price changes and stock updates, and comprehensive tracking capabilities on platforms such as Flipkart. These tools provide invaluable insights into market trends and competitor pricing strategies. Our service is tailored to meet your specific business needs,
                        delivering timely and actionable data that helps you make informed decisions, optimize your pricing strategy, and maintain a competitive advantage. Whether you choose the flexibility of a monthly plan or the cost efficiency of an annual subscription, Priceluxe equips you with the intelligence needed to excel in the ever-evolving e-commerce landscape.</p>
                </div>
            </div>
        </div>
    );
};

export default Service;
