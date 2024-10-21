import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Map from './Map';
import LandlordProfile from './LandlordProfile';
import ClearSelectionIcon from '../Assets/clear-selection.svg';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MyBookmark from '../Assets/my bookmark.svg';
import SelectedBookmark from '../Assets/mybookmark-title.svg';
import './SearchResults.css';
import SideMenu from './SideMenu';
import { isTokenValid } from './authentication';  
import NoAccountSideMenu from './NoAccountSideMenu';  // Import the logged-out side menu

function SearchPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('landlord');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [bookmarked, setBookmarked] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { results: fetchedResults } = location.state || {};

  // Function to fetch bookmarks when the user logs in
  const fetchBookmarks = (token) => {
    fetch('http://localhost:5000/api/bookmarks', {
      headers: {
        'Authorization': `Bearer ${token}`  // Send JWT token for authentication
      }
    })
      .then(response => response.json())
      .then(bookmarkedLandlords => {
        // Create a new object to store bookmark state
        const updatedBookmarked = {};

        // Mark the landlords as bookmarked
        bookmarkedLandlords.forEach(landlordId => {
          updatedBookmarked[landlordId] = true;
        });

        // Update the bookmark state
        setBookmarked(updatedBookmarked);
      })
      .catch(error => {
        console.error('Error fetching bookmarks:', error);
      });
  };
//checks if user is logged and if not would make user unable to bookmark and save it it 
//their account

useEffect(() => {
  if (isTokenValid()) {
    setIsLoggedIn(true);
    const token = localStorage.getItem('token');
    fetchBookmarks(token);  // Call your fetchBookmarks function
  } else {
    setIsLoggedIn(false);
  }
}, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const handleClear = () => {
    setSearchQuery('');  // Clear the search query
    setSortBy('');       // Clear the sort option
  };
  const toggleBookmark = (landlordId) => {
    if (!isLoggedIn) {
      alert('Please log in to bookmark landlords.');
      navigate('/SignIn');  // Redirect to sign-in page if user is not logged in
      return;
    }

    // Toggle bookmark state locally
    const isBookmarked = bookmarked[landlordId];  // Check if it's currently bookmarked

    setBookmarked((prevBookmarked) => ({
      ...prevBookmarked,
      [landlordId]: !prevBookmarked[landlordId],  // Toggle the bookmark state
    }));

    // Call backend to either store or remove bookmark
    const token = localStorage.getItem('token');  // JWT token stored in localStorage

    // Determine the request method (POST for add, DELETE for remove)
    const method = isBookmarked ? 'DELETE' : 'POST';

    fetch('http://localhost:5000/api/bookmark', {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Send the JWT token for authentication
      },
      body: JSON.stringify({ landlordId }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.message) {
          console.log(data.message);  // Handle the success message
        }
      })
      .catch(error => {
        console.error(`Error ${isBookmarked ? 'removing' : 'adding'} bookmark:`, error);
      });
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {  // Check if the search query is empty or only contains spaces
      alert('Please enter a search query.');  // Show an alert if the query is empty
      return;  // Stop further execution if the query is empty
    }
    console.log(`SearchType: ${searchType}, SearchQuery: ${searchQuery}, SortBy: ${sortBy}`);
    const searchQueryEncoded = encodeURIComponent(searchQuery);
  const sortByQuery = sortBy ? `&sortBy=${sortBy}` : '';setLoading(true);
    fetch(`/api/search?searchBy=${searchType}&query=${encodeURIComponent(searchQuery)}${sortByQuery}`, {
      headers: {
      'Cache-Control': 'no-cache'
    }})
    .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();  // This could throw if the response is HTML
  })
  .then(data => {
    setResults(data);
    setLoading(false);
  })
  .catch(error => {
    console.error('Error fetching search results:', error);
    setLoading(false);
  });

  };

  // Sort results without triggering unnecessary re-renders or updates
useEffect(() => {
  const sortResults = (data) => {
    if (sortBy === "rating") {
      return [...data].sort((a, b) => b.averageRating - a.averageRating);  // Sort by highest rating
    } else if (sortBy === "Landlord name") {
      return [...data].sort((a, b) => a.name.localeCompare(b.name));  // Sort by landlord name
    } else if (sortBy === "lowest rating") {
      return [...data].sort((a, b) => a.averageRating - b.averageRating);  // Sort by lowest rating
    } else if (sortBy === "property name") {
      return [...data].sort((a, b) => {
        const propertyA = a.properties[0]?.propertyname || "";
        const propertyB = b.properties[0]?.propertyname || "";
        return propertyA.localeCompare(propertyB);
      });  // Sort by property name
    } else if (sortBy === "reviews") {
      return [...data].sort((a, b) => b.reviewCount - a.reviewCount);  // Sort by most reviews
    }
    return data;  // Default: no sorting
  };

  // Only sort the results when results or sortBy change, no infinite loop
  if (results && results.length > 0) {
    const sortedResults = sortResults(results);
    setResults(sortedResults);  // This will update results once with the sorted data
  }
}, [sortBy]);  // Only depend on sortBy, not results

// Handle fetching results only when necessary (i.e., after a new search is performed)
useEffect(() => {
  if (fetchedResults) {
    setResults(fetchedResults);  // Update with newly fetched results
  }
}, [fetchedResults]);  // This effect should only trigger when fetchedResults changes

  // Use navigate to navigate to the landlord profile page
  const handleLandlordClick = (landlordId) => {
    navigate(`/LandlordProfile/${landlordId}`);
  };
  return (
    <div className="search-page-container">
      {isLoggedIn ? <SideMenu /> : <NoAccountSideMenu />}

      <header className="header">
        <div className="logo-container" onClick={() => navigate('/')}>
          <img src={OfficialLogo} alt="Official Logo" className="center-logo" />
        </div>
        <div className="buttons-container">
          <img src={SubmitLandlordRate} alt="Submit Landlord Rate" className="left-icon" />
          <img src={AccountButton} alt="Account Button" className="account-right" 
          onClick={() =>{ 
            if (isTokenValid()) {
            navigate('/myaccount');  // Navigate to "My Account" if logged in
          } else {
            navigate('/signin');  // Navigate to "Sign In" if not logged in
          }
        }}/>
        </div>
      </header>

      <div className="searchby-and-sort-wrapper">
  <div className="searchresults-bar-container">
    {/* Search Type Dropdown */}
    <select className="searchby-dropdown" value={searchType} onChange={handleSearchTypeChange}>
      <option value="Landlord Name">Landlord Name</option>
      <option value="Property Name">Property Name</option>
      <option value="Address">Address</option>
      <option value="City">City</option>
      <option value="Zipcode">ZipCode</option>
    </select>

    <div className="input-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
  <input
    type="text"
    value={searchQuery}
    onChange={handleSearchChange}
    placeholder={`Search by ${searchType}`}
    className="searchby-input"
    onKeyDown={handleKeyDown}
    style={{ paddingRight: '30px' }}  // Add padding to make room for the icon
  />

  {/* Add Clear Icon Inside Input */}
  {searchQuery || sortBy ? (
    <div
      className="clear-icon"
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        width: '20px',
        height: '20px',
        backgroundImage: `url(${ClearSelectionIcon})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={handleClear}  // Make the div clickable
    />
  ) : null}
</div>
  </div>

  {/* Sort Dropdown */}
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
              results.map((result) => (
                <div className="result-card" key={result.landlordId} onClick={() => handleLandlordClick(result.landlordId)}>
                  <div className="result-card-header">
                    <div className="rating-box">
                      <span>Avg Rating</span>
                      <h3>{result.averageRating ? result.averageRating.toFixed(1) : 'No Rating'}</h3>
                      <p>{result.reviewCount} Reviews</p>
                    </div>
                    <div className="landlord-info">
                      <h2>{result.name}</h2>
                      {result.properties && result.properties.length > 0 ? (
                        result.properties.map((property, idx) => (
                          <p key={idx}>{property.address}, {property.city}</p>
                        ))
                      ) : (
                        <p>No address available</p>
                      )}
                    </div>
                    <div className="bookmark-icon" onClick={(e) => {
                      e.stopPropagation(); // Prevents the card click event from being triggered
                      toggleBookmark(result.landlordId);
                    }}><img
                        src={bookmarked[result.landlordId] ? SelectedBookmark : MyBookmark}
                        alt="Bookmark"
                        className="bookmark-icon-img"
                      />
                    </div>
                  </div>

                  <div className="result-card-body">
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
      {/* Map Section */}
      <section className="result-map-section">
        <div className="result-map-container">
          <Map mapHeight="400px" />
        </div>
      </section>
    </div>
  );
}

export default SearchPage;
