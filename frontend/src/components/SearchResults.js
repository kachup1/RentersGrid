<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import Map from './Map';
=======
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import SearchResultsMap from './SearchResultsMap';
>>>>>>> francisco-b
//list of all assets and pages.
import LandlordProfile from './LandlordProfile'; //not working 
import ClearSelectionIcon from '../Assets/clear-selection.svg';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MyBookmark from '../Assets/my bookmark.svg';
import SelectedBookmark from '../Assets/mybookmark-title.svg';
import NoAccountSideMenu from './NoAccountSideMenu';  // Import the logged-out side menu
import SideMenu from './SideMenu';
import './SearchResults.css';
//authentication per page if user is logged in.
import { isTokenValid } from './authentication';  

function SearchPage() {
  //keeps track of used states 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('landlord');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
<<<<<<< HEAD
=======
  const resultsRefs = useRef([]); // Array of refs for each search result

>>>>>>> francisco-b
  const [bookmarked, setBookmarked] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const { results: fetchedResults } = location.state || {};

  const refreshAndNavigate = () => {
    navigate('/');  
    window.location.reload(); 
  };
  // Function to fetch bookmarks when the user logs in
  const fetchBookmarks = (token) => {
    fetch('http://localhost:5000/api/bookmarks', {
      headers: {
        'Authorization': `Bearer ${token}`  // Sends JWT token for authentication
      }
    })
      .then(response => response.json())
      .then(bookmarkedLandlords => {
        // Create a new object to store the bookmark state
        const updatedBookmarked = {};

        // Marks the landlords as bookmarked
        bookmarkedLandlords.forEach(landlordId => {
          updatedBookmarked[landlordId] = true;
        });

        // Updates the bookmark state
        setBookmarked(updatedBookmarked);
      })
      .catch(error => {
        console.error('Error fetching bookmarks:', error);
      });
  };
//checks if user is logged and if not would make user unable to bookmark and save it it 
//their account
<<<<<<< HEAD
=======

>>>>>>> francisco-b
useEffect(() => {
  if (isTokenValid()) {
    setIsLoggedIn(true);
    const token = localStorage.getItem('token');
    fetchBookmarks(token);  // Call your fetchBookmarks function
  } 
  // if no token is found the status is false.
  else {
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
    setSearchQuery('');  // Clears the search query
    setSortBy('');       // Clears the sort option
  };

  const toggleBookmark = (landlordId) => {
    // Redirects to sign-in page if user is not logged in
    if (!isLoggedIn) {
      alert('Please log in to bookmark landlords.');
      navigate('/SignIn');  
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
          console.log(data.message);  // Handles the success message
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
<<<<<<< HEAD
=======
    console.log("Search API Data:", data); // Add this line

>>>>>>> francisco-b
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

<<<<<<< HEAD
=======
  const scrollToResult = (index) => {
    if (resultsRefs.current[index]) {
      resultsRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

>>>>>>> francisco-b
  return (
    <div className="search-page-container">
      {/*//checks the login status and gives a type of sidemenu depending onit.*/}
      {isLoggedIn ? <SideMenu /> : <NoAccountSideMenu />}


      <header className="header">
        <div className="logo-container">
          <img src={OfficialLogo} alt="Official Logo" className="center-logo" onClick={refreshAndNavigate}/>
        </div>
        <div className="buttons-container">
          <img src={SubmitLandlordRate} alt="Submit Landlord Rate" className="left-icon" />
          <img src={AccountButton} alt="Account Button" className="account-right" 
          onClick={() =>{ 
            if (isTokenValid()) {
          // Navigates to "My Account" if user is logged by checking token.
            navigate('/myaccount');  
          } 
          //If token is not found goes to sign in page.
          else {
            navigate('/signin');  // Navigate to "Sign In" if not logged in
          }
        }}/>
        </div>
      </header>

      <div className="searchby-and-sort-wrapper">
  <div className="searchresults-bar-container">
    {/* Search Type Dropdown */}
    <select className="searchby-dropdown" value={searchType} onChange={handleSearchTypeChange}>
      <option value="landlord">Landlord Name</option>
      <option value="property">Property Name</option>
      <option value="address">Address</option>
      <option value="city">City</option>
      <option value="zipcode">Zip Code</option>
    </select>

    <div className="input-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
  <input
    type="text"
    value={searchQuery}
    onChange={handleSearchChange}
    placeholder={`Search by ${searchType === 'landlord' ? 'Landlord Name' : searchType === 'property' ? 'Property Name' : searchType.charAt(0).toUpperCase() + searchType.slice(1)}`}
    className="searchby-input"
    onKeyDown={handleKeyDown}
    style={{ paddingRight: '30px' }}  // Adds padding to make room for the icon
  />

  {/* Add Clear Icon Inside Input by checking if their is value.*/}
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
<<<<<<< HEAD
            {results && results.length > 0 ? (
              results.map((result) => (
                <div className="result-card" key={result.landlordId} onClick={() => handleLandlordClick(result.landlordId)}>
=======
          {results && results.length > 0 ? (
              results.map((result, index) => (
                <div
                  className="result-card"
                  key={result.landlordId}
                  ref={(el) => (resultsRefs.current[index] = el)} // Attach ref to each result
                  onClick={() => handleLandlordClick(result.landlordId)}
                >
>>>>>>> francisco-b
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
                          <p key={idx}>{property.address}, {property.city}, {property.zipcode}</p>
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
<<<<<<< HEAD
      {/* Map Section */}
      <section className="result-map-section">
        <div className="result-map-container">
          <Map mapHeight="400px" />
=======
      {/* Search Results Map */}
      <section className="result-map-section">
        <div className="result-map-container">
          <SearchResultsMap filteredResults={results} 
          onMarkerClick={scrollToResult} // Pass scrollToResult as a prop
/>
>>>>>>> francisco-b
        </div>
      </section>
    </div>
  );
}

export default SearchPage;