import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import { useLocation } from 'react-router-dom';

import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MyBookmark from '../Assets/my bookmark.svg';
import Map from '../components/Map';

import './SearchResults.css';
import SideMenu from './SideMenu';

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('landlord'); // Default to landlord name
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);              // Loading state

  const [results, setResults] = useState([]); // State for holding search results
  const navigate = useNavigate();
  const location = useLocation();
  //destructured state variable to avoid conflict
  const { results: fetchedResults } = location.state || {};  // Fallback to {} in case there's no state

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  // Reusing the same search logic from NoAccountHomePage
  const handleSearch = () => {
    setLoading(true); // Show loading indicator
    fetch(`/api/search?searchBy=${searchType}&query=${encodeURIComponent(searchQuery)}&sortBy=${sortBy}`)

      .then(response => response.json())
      .then(data => {
        setResults(data);   // Update search results
        setLoading(false);  // Stop loading indicator
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
        setLoading(false); // Stop loading indicator
      });
  };
  const handleBookmarkClick = (landlordId) => {
    console.log(`Bookmark clicked for landlord ID: ${landlordId}`);
    // You can add logic here to handle bookmark actions, like saving to a database
  };
  useEffect(() => {
    if (fetchedResults) {
      setResults(fetchedResults); // Populate the results from location state if available
    }
  }, [fetchedResults]);
  return (
    <div className="search-page-container">
      {/* Side Menu Component */}
      <SideMenu />

      {/* Header Section */}
      <header className="header">
        <div className="logo-container">
          <img src={OfficialLogo} alt="Official Logo" className="center-logo" />
        </div>
        <div className="buttons-container">
          {/* Left Button/Icon */}
          <img
            src={SubmitLandlordRate}
            alt="Submit Landlord Rate"
            className="left-icon"
          />
          {/* Right Button/Icon */}
          <img
            src={AccountButton}
            alt="Account Button"
            className="account-right"
          />
        </div>
      </header>

      {/* Search Bar and Sort By Container */}
      <div className="searchby-and-sort-wrapper">
        {/* Search Bar Container */}
        <div className="searchresults-bar-container">
          <select className="searchby-dropdown"
            value={searchType}
            onChange={handleSearchTypeChange} // Update searchType on change
          >
            <option value="landlord">Landlord Name</option>
            <option value="Property">Property Name</option>
            <option value="address">Address</option>
            <option value="City">City</option>
            <option value="zipcode">Zip Code</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={`Search by ${searchType}`}
            className="searchby-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>

        {/* Sort By Dropdown Below the Search Bar */}
        <div className="sort-container">
          <label htmlFor="sort" className="sort-label">Search Results:</label>
          <select
            id="sort"
            className="sort-button"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="">Sort By</option>
            <option value="rating">Highest Rating</option>
            <option value="Landlord name">Landlord Name</option>
            <option value="lowest rating">Lowest Rating</option>
            <option value="property name">Property Name</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>
        <div className="search-results-container">
          <h1>Search Page</h1>
          <div className="results-list">
            {results && results.length > 0 ? (
              results.map((result, index) => (
                <div className="result-card" key={index}>
                  <div className="result-card-header">
                    <div className="rating-box">
                      <h3>{result.ratingId}</h3> {/* Display rating */}
                      <span>Rating</span>
                    </div>
                    <div className="landlord-info">
                      <h2>{result.name}</h2>
                      {/* Access the address and city from the properties array */}
                      {result.properties && result.properties.length > 0 ? (
                        result.properties.map((property, idx) => (
                          <p key={idx}>{property.address}, {property.city}</p>
                        ))
                      ) : (
                        <p>No address available</p>
                      )}
                    </div>
                    <div className="bookmark-icon" onClick={() => handleBookmarkClick(result._id)}>
                      <img
                        src={MyBookmark}
                        alt="Bookmark"
                        className="bookmark-icon-img"
                      />
                    </div>
                  </div>
                  <div className="result-card-body">
                    {/* Check if propertyname exists */}
                    {result.properties && result.properties.length > 0 && result.properties[0].propertyname ? (
                      <p>{result.properties[0].propertyname}</p>
                    ) : (
                      <p>No property information available</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No results found.</p>
            )}
          </div>
        </div>
      </div>
      <section className="result-map-section">
        <div className="result-map-container">
          <Map mapHeight="400px" />
        </div>
      </section>
    </div>


  );
}

export default SearchPage;