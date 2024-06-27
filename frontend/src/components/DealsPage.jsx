import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalComponent from './Modal';
import ProductDetailsPage from './ProductDetailsPage';
import './DealsPage.css';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(20); // Number of items to show initially

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/all-results');
        setDeals(shuffleArray(data));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deals:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const openModal = (deal) => {
    setCurrentProduct(deal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const calculatePriceDifference = (priceHistory) => {
    if (!priceHistory || priceHistory.length < 2) {
      return null;
    }
    const latestPrice = priceHistory[priceHistory.length - 1].price;
    const previousPrice = priceHistory[priceHistory.length - 2].price;
    const difference = latestPrice - previousPrice;
    const percentage = ((difference / previousPrice) * 100).toFixed(2);
    const isIncreasing = difference > 0;

    return { difference, percentage, isIncreasing };
  };

  const loadMoreItems = () => {
    setItemsToShow(itemsToShow + 10); // Load 5 more items
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="deals-container">
      <h1 className='ve'>Deals</h1>
      <br></br>
      <div className="deals-list">
        {deals.slice(0, itemsToShow).map((deal) => {
          const priceDiff = calculatePriceDifference(deal.priceHistory);
          return (
            <div key={deal._id} className="deal-card">
              <img src={deal.img} alt={deal.name} className="deal-image" />
              <div className="deal-details">
                <a onClick={() => openModal(deal)} className="deal-link">
                  <h2 style={{ color: "black" }}>{deal.name}</h2>
                </a>
                <p className="deal-source">{deal.source}</p>
                <p className="deal-price">₹{deal.price}</p>
                {priceDiff && (
                  <p className={`deal-price-diff ${priceDiff.isIncreasing ? 'increasing' : 'decreasing'}`}>
                    {priceDiff.isIncreasing ? '▲' : '▼'} ₹{priceDiff.difference} ({priceDiff.percentage}%)
                  </p>
                )}
                <button onClick={() => openModal(deal)}>View Details</button>
              </div>
            </div>
          );
        })}
      </div>
      {itemsToShow < deals.length && (
        <button onClick={loadMoreItems} className="load-more-button">Load More</button>
      )}
      {currentProduct && (
        <ModalComponent
          isOpen={isModalOpen}
          closeModal={closeModal}
          content={<ProductDetailsPage product={currentProduct} />}
        />
      )}
    </div>
  );
};

export default DealsPage;
