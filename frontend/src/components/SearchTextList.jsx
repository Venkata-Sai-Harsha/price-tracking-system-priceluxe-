import React from 'react';
import './SearchTextList.css'; // Assuming you have a separate CSS file

function SearchTextList({ searchTexts, onSearchTextClick }) {
  return (
    <div>
      <h2>All Products</h2>
      <ul className="product-list">
        {searchTexts.map((searchText, index) => (
          <li key={index} onClick={() => onSearchTextClick(searchText)}>
            <button>{searchText}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchTextList;
