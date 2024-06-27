import React, { useState, useEffect } from "react";
import "./Home.css";
import SearchTextList from "./SearchTextList";
import PriceHistoryTable from "./PriceHistoryTable";
import TrackedProductList from "./TrackedProductList";

function Home({
  searchTexts,
  handleNewSearchTextSubmit,
  newSearchText,
  handleNewSearchTextChange,
  handleSearchTextClick,
  showPriceHistory,
  priceHistory,
  handlePriceHistoryClose,
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset loading state when component unmounts
    return () => setLoading(false);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await handleNewSearchTextSubmit(event);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    setLoading(true);
    try {
      await handlePriceHistoryClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <br></br>
      <br></br>
      <div className="search-form-container">
        <form onSubmit={handleSubmit} className="search-form">
          <h5>
            <label className="search-form-label">Search for a new item:</label>
          </h5>
          <input
            type="text"
            value={newSearchText}
            onChange={handleNewSearchTextChange}
            className="search-form-input"
          />
          <button type="submit" className="search-form-button" disabled={loading}>
            {loading ? "Loading..." : "Start Scraper"}
          </button>
        </form>
      </div>
      <SearchTextList
        searchTexts={searchTexts}
        onSearchTextClick={handleSearchTextClick}
      />
      <TrackedProductList />
      {showPriceHistory && (
        <PriceHistoryTable
          priceHistory={priceHistory}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default Home;
