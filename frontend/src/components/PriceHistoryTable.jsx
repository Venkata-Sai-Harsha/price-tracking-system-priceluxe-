import React, { useState } from "react";
import ModalComponent from './Modal';
import ProductDetailsPage from "./ProductDetailsPage";
import "./PriceHistoryTable.css";

function PriceHistoryTable({ priceHistory, onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});

  const openModal = (product) => {
    if (product.priceHistory.length > 0) {
      setCurrentProduct(product);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getPriceChange = (priceHistory) => {
    if (priceHistory.length < 2) return 0;
    const currentPrice = priceHistory[0].price;
    const lastPrice = priceHistory[1].price;
    const change = ((currentPrice - lastPrice) / lastPrice) * 100;
    return Math.round(change * 100) / 100;
  };

  return (
    <div>
      <h2>Price History</h2>
      <table className="price-history-table">
        <thead>
          <tr>
            <th>Updated At</th>
            <th>Name</th>
            <th>Price</th>
            <th>Price Change</th>
          </tr>
        </thead>
        <tbody>
          {priceHistory.map((product) =>
            product.priceHistory.map((priceData, index) => {
              const change = index === 0 ? getPriceChange(product.priceHistory) : 0;
              return (
                <tr key={`${product.url}-${priceData.date}`}>
                  <td>{priceData.date}</td>
                  <td><a onClick={() => openModal(product)}>{product.name}</a></td>
                  <td>₹{priceData.price}</td>
                  <td style={{ color: change > 0 ? "red" : "green" }}>
                    {change >= 0 && "+"}
                    {change}%
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <button className="close-button" onClick={onClose}>Close</button>
      <ModalComponent
        isOpen={isModalOpen}
        closeModal={closeModal}
        content={<ProductDetailsPage product={currentProduct} />}
      />
    </div>
  );
}

export default PriceHistoryTable;
