import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import "./ProductDetailsPage.css";

const ProductDetailsPage = ({ product, userId }) => {
  const {
    name,
    url: productUrl,
    img,
    source,
    created_at: createdAt,
    priceHistory,
  } = product || {};

  const [alertSet, setAlertSet] = useState(false);
  const [notification, setNotification] = useState('');
  const [alertPrice, setAlertPrice] = useState('');

  useEffect(() => {
    // Check if alert is already set for the product by the user
    const checkAlertStatus = async () => {
      try {
        const response = await axios.get('/check_alert', {
          params: {
            product_id: product.id,
            user_id: userId,
          },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.alert_set) {
          setAlertSet(true);
          setAlertPrice(response.data.alert_price);
        }
      } catch (error) {
        console.error('Error checking alert status:', error);
      }
    };

    checkAlertStatus();

    // Periodically check for price changes
    const intervalId = setInterval(() => {
      checkPrice();
    }, 60000); // Check every minute (adjust as necessary)

    return () => clearInterval(intervalId);
  }, [product.id, userId]);

  const formatDate = (date) => {
    const aaaa = date.getFullYear();
    const gg = date.getDate();
    const mm = date.getMonth() + 1;

    const cur_day = `${aaaa}-${mm < 10 ? "0" + mm : mm}-${gg < 10 ? "0" + gg : gg}`;

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${cur_day} ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }

  const dates = priceHistory
    ? priceHistory.map((history) => formatDate(new Date(history.date))).reverse()
    : [];
  const prices = priceHistory ? priceHistory.map((history) => history.price).reverse() : [];

  const chartData = {
    options: {
      chart: {
        id: "price-chart",
      },
      xaxis: {
        categories: dates,
      },
    },
    series: [
      {
        name: "Price",
        data: prices,
      },
    ],
  };

  const setPriceAlert = async () => {
    if (!alertPrice) {
      setNotification('Please enter a price.');
      return;
    }

    try {
      const response = await axios.post('/set_alert', {
        product_id: product.id,
        user_id: userId,
        alert_price: alertPrice
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setAlertSet(true);
        setNotification('Price alert has been set.');
      } else {
        setNotification('Failed to set price alert.');
      }
    } catch (error) {
      console.error('Error setting price alert:', error);
      setNotification('Price alert set successfully.');
    }

    // Clear notification after 20 seconds
    setTimeout(() => {
      setNotification('');
    }, 20000);
  };

  const checkPrice = async () => {
    try {
      const response = await axios.post('/check_price', {
        product_id: product.id,
        user_id: userId,
        new_price: prices.length > 0 ? prices[prices.length - 1] : 0,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.onsite_notification) {
        setNotification(response.data.message);

        // Clear notification after 5 seconds
        setTimeout(() => {
          setNotification('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error checking price:', error);
    }
  };

  return (
    <div className="page-container">
      <h2 className="black">{name}</h2>
      <img src={img} alt="Product" />
      <p>
        URL:{" "}
        <a href={`${source}${productUrl}`} target="_blank" rel="noopener noreferrer">
          View product.
        </a>
      </p>
      <p>
        Source:{" "}
        <a target="_blank" rel="noopener noreferrer" href={source}>
          {source}
        </a>
      </p>
      <p>Newest Price At: {createdAt}</p>
      <h2>Price History</h2>
      <h3 className="sai">
        Current Price: ₹{prices.length > 0 ? prices[prices.length - 1] : "N/A"}
      </h3>
      <div className="chart-container">
        <ApexCharts
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={300}
        />
      </div>
      <div className="alert-container">
        <input
          type="number"
          placeholder="Enter price for alert"
          value={alertPrice}
          onChange={(e) => setAlertPrice(e.target.value)}
          disabled={alertSet}
        />
        <button onClick={setPriceAlert} className="alert-button" disabled={alertSet}>
          {alertSet ? "Alert Set" : "Set Price Alert"}
        </button>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default ProductDetailsPage;
