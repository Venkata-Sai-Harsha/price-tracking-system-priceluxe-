import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Forgot from "./components/Forgot";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Subscription from './components/Subscription';
import DealsPage from './components/DealsPage'; 
import ProductDetailsPage from './components/ProductDetailsPage'; 
import About from "./components/About";
import Service from "./components/Service";
import Contact from "./components/Contact";
import UserProfile from "./components/UserProfile";
import "./App.css";

const URL = "http://localhost:5000";

function App() {
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [searchTexts, setSearchTexts] = useState([]);
  const [newSearchText, setNewSearchText] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUniqueSearchTexts();
    checkAuthStatus();
    fetchDeals();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const storedFullName = localStorage.getItem("fullName");
    if (token && name) {
      setIsAuthenticated(true);
      setUserName(name);
      setEmail(userEmail);
      setFullName(storedFullName);
      fetchUserProfile(token);
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${URL}/user-profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = response.data;
      setFullName(data.fullName);
      localStorage.setItem("fullName", data.fullName); // Store full name in localStorage
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchUniqueSearchTexts = async () => {
    try {
      const response = await axios.get(`${URL}/unique_search_texts`);
      const data = response.data;
      setSearchTexts(data);
    } catch (error) {
      console.error("Error fetching unique search texts:", error);
    }
  };

  const fetchDeals = async () => {
    try {
      const { data } = await axios.get(`${URL}/all-results`);
      setDeals(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleSearchTextClick = async (searchText) => {
    try {
      const response = await axios.get(`${URL}/results?search_text=${searchText}`);
      const data = response.data;
      setPriceHistory(data);
      setShowPriceHistory(true);
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  };

  const handlePriceHistoryClose = () => {
    setShowPriceHistory(false);
    setPriceHistory([]);
  };

  const handleNewSearchTextChange = (event) => {
    setNewSearchText(event.target.value);
  };

  const handleNewSearchTextSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${URL}/start-scraper`, {
        search_text: newSearchText,
        url: "https://amazon.in",
      });
      alert("Scraper started successfully. Please wait for 2-3 minutes.");
      setSearchTexts([...searchTexts, newSearchText]);
      setNewSearchText("");
    } catch (error) {
      alert("Error starting scraper:", error);
    }
  };

  const handleLoginSuccess = async (token, name, email) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    setIsAuthenticated(true);
    setUserName(name);
    setEmail(email);
    await fetchUserProfile(token);
  };

  const handleSignupSuccess = (token, name, email) => {
    handleLoginSuccess(token, name, email);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("fullName");
    setIsAuthenticated(false);
    setUserName("");
    setEmail("");
    setFullName("");
  };

  const handleForgotPassword = async (email) => {
    try {
      const response = await axios.post(`${URL}/forgot-password`, { email });
      alert("Password reset instructions have been sent to your email.");
    } catch (error) {
      console.error("Error sending password reset instructions:", error);
      alert("Failed to send password reset instructions.");
    }
  };

  const getDealsWithPriceChanges = (deals) => {
    return deals.filter(deal => {
      if (!deal.priceHistory || deal.priceHistory.length < 2) {
        return false;
      }
      const latestPrice = deal.priceHistory[deal.priceHistory.length - 1].price;
      const previousPrice = deal.priceHistory[deal.priceHistory.length - 2].price;
      return latestPrice !== previousPrice;
    });
  };

  return (
    <Router>
      <div className="main">
        <Header isAuthenticated={isAuthenticated} userName={userName} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route
            path="/home"
            element={
              <Home
                searchTexts={searchTexts}
                handleNewSearchTextSubmit={handleNewSearchTextSubmit}
                newSearchText={newSearchText}
                handleNewSearchTextChange={handleNewSearchTextChange}
                handleSearchTextClick={handleSearchTextClick}
                showPriceHistory={showPriceHistory}
                priceHistory={priceHistory}
                handlePriceHistoryClose={handlePriceHistoryClose}
              />
            }
          />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/forgot" element={<Forgot onForgotPassword={handleForgotPassword} />} />
          <Route path="/signup" element={<Signup onSignupSuccess={handleSignupSuccess} />} />
          <Route path="/subscribe" element={<Subscription />} />
          <Route path="/deals" element={<DealsPage deals={getDealsWithPriceChanges(deals)} />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service" element={<Service />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} /> 
          <Route path="/userprofile" element={<UserProfile username={userName} userEmail={email} initialFullName={fullName} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
