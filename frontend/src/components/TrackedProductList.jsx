import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TrackedProductList.css"

const TrackedProductList = () => {
  const [trackedProducts, setTrackedProducts] = useState([]);
  const [newTrackedProduct, setNewTrackedProduct] = useState("");

  useEffect(() => {
    fetchTrackedProducts();
  }, []);

  const fetchTrackedProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/tracked-products"
      );

      setTrackedProducts(response.data);
    } catch (error) {
      console.error("Error fetching tracked products:", error);
    }
  };

  const handleNewTrackedProductChange = (event) => {
    setNewTrackedProduct(event.target.value);
  };

  const handleAddTrackedProduct = async () => {
    if (newTrackedProduct.trim() === "") return;
    try {
      const response = await axios.post(
        "http://localhost:5000/add-tracked-product",
        {
          name: newTrackedProduct,
        }
      );
      const { id } = response.data;
      setTrackedProducts((prevProducts) => [
        ...prevProducts,
        { id, name: newTrackedProduct, tracked: true },
      ]);
      setNewTrackedProduct("");
    } catch (error) {
      console.error("Error adding tracked product:", error);
    }
  };

  const handleToggleTrackedProduct = async (productId) => {
    try {
      await axios.put(`http://localhost:5000/tracked-product/${productId}`);
      setTrackedProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, tracked: !product.tracked }
            : product
        )
      );
    } catch (error) {
      console.error("Error toggling tracked product:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddTrackedProduct();
    }
  };

  return (
    <div>
      <h2>Tracked Products</h2>
      <ul>
        {trackedProducts.map((product) => (
          <li key={product.id}>
            {product.name}{" "}
            <input
              type="checkbox"
              onChange={() => handleToggleTrackedProduct(product.id)}
              checked={product.tracked}
            />
          </li>
        ))}
      </ul>

      <div className="add-tracked-product">
        <h4>Add Tracked Product:</h4>
        <input 
          type="text"
          value={newTrackedProduct}
          onChange={handleNewTrackedProductChange}
          onKeyPress={handleKeyPress} // Add this line
        />
        <button onClick={handleAddTrackedProduct} className="submit-button">Add</button>
      </div>
    </div>
  );
};

export default TrackedProductList;
