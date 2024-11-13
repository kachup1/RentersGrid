import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchResultsMap from './SearchResultsMap';
// list of all assets and pages.
import LandlordProfile from './LandlordProfile'; // not working 
import ClearSelectionIcon from '../Assets/clear-selection.svg';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MyBookmark from '../Assets/fav-unselect.svg';
import SelectedBookmark from '../Assets/saved-bookmark.svg';
import NoAccountSideMenu from './NoAccountSideMenu';  // Import the logged-out side menu
import SideMenu from './SideMenu';
import './SearchResults.css';
// authentication per page if user is logged in.
import { isTokenValid } from './authentication';

function SearchResultsPage() {
  // keeps track of used states 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('landlord');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchresults, setSearchResults] = useState([]);
  const searchresultsRefs = useRef([]); // Array of refs for each search result

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
        const updatedBookmarked = {};
        bookmarkedLandlords.forEach(landlordId => {
          updatedBookmarked[landlordId] = true;
        });
        setBookmarked(updatedBookmarked);
      })
      .catch(error => {
        console.error('Error fetching bookmarks:', error);
      });
  };

  useEffect(() => {
    if (isTokenValid()) {
      setIsLoggedIn(true);
      const token = localStorage.getItem('token');
      fetchBookmarks(token);
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
    setSearchQuery('');  
    setSortBy('');       
  };

  const toggleBookmark = (landlordId) => {
    if (!isLoggedIn) {
      alert('Please log in to bookmark landlords.');
      navigate('/SignIn');  
      return;
    }

    const isBookmarked = bookmarked[landlordId];

    setBookmarked((prevBookmarked) => ({
      ...prevBookmarked,
      [landlordId]: !prevBookmarked[landlordId],
    }));

    const token = localStorage.getItem('token');
    const method = isBookmarked ? 'DELETE' : 'POST';

    fetch('http://localhost:5000/api/bookmark', {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
          console.log(data.message);
        }
      })
      .catch(error => {
        console.error(`Error ${isBookmarked ? 'removing' : 'adding'} bookmark:`, error);
      });
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query.');
      return;
    }
    console.log(`SearchType: ${searchType}, SearchQuery: ${searchQuery}, SortBy: ${sortBy}`);
    const searchQueryEncoded = encodeURIComponent(searchQuery);
    const sortByQuery = sortBy ? `&sortBy=${sortBy}` : '';
    setLoading(true);
    fetch(`/api/search?searchBy=${searchType}&query=${searchQueryEncoded}${sortByQuery}`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Search API Data:", data);
      setSearchResults(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching search results:', error);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (fetchedResults) {
      setSearchResults(fetchedResults);
    }
  }, [fetchedResults]);

  const handleLandlordClick = (landlordId) => {
    navigate(`/LandlordProfile/${landlordId}`);
  };

  const scrollToResult = (index) => {
    if (searchresultsRefs.current[index]) {
      searchresultsRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="searchresults-page-container">
      {isLoggedIn ? <SideMenu /> : <NoAccountSideMenu />}
  
      <header className="searchresults-header">
        <div className="searchresults-logo-container">
          <img src={OfficialLogo} alt="Official Logo" className="searchresults-center-logo" onClick={refreshAndNavigate} />
        </div>
        <div className="searchresults-buttons-container">
          <img src={SubmitLandlordRate} alt="Submit Landlord Rate" className="searchresults-left-icon" />
          <img
            src={AccountButton}
            alt="Account Button"
            className="searchresults-account-right"
            onClick={() => {
              if (isTokenValid()) {
                navigate('/myaccount');
              } else {
                navigate('/signin');
              }
            }}
          />
        </div>
      </header>
  
      <div className="searchresults-searchby-and-sort-wrapper">
        <div className="searchresults-bar-container">
          <select className="searchresults-dropdown" value={searchType} onChange={handleSearchTypeChange}>
            <option value="landlord">Landlord Name</option>
            <option value="property">Property Name</option>
            <option value="address">Address</option>
            <option value="city">City</option>
            <option value="zipcode">Zip Code</option>
          </select>
  
          <div className="searchresults-input-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={`Search by ${searchType === 'landlord' ? 'Landlord Name' : searchType === 'property' ? 'Property Name' : searchType.charAt(0).toUpperCase() + searchType.slice(1)}`}
              className="searchresults-input"
              onKeyDown={handleKeyDown}
              style={{ paddingRight: '30px' }}
            />
            {searchQuery || sortBy ? (
              <div
                className="searchresults-clear-icon"
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
                onClick={handleClear}
              />
            ) : null}
          </div>
        </div>
  
        <div className="searchresults-sort-container">
          <label htmlFor="sort" className="searchresults-sort-label">Search Results: </label>
          <select id="sort" className="searchresults-sort-button" value={sortBy} onChange={handleSortChange}>
            <option value="">Sort By</option>
            <option value="rating">Highest Rating</option>
            <option value="Landlord name">Landlord Name</option>
            <option value="lowest rating">Lowest Rating</option>
            <option value="property name">Property Name</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>
      </div>
  
      <div className="searchresults-main-content">
        <div className="searchresults-map-container">
          <SearchResultsMap filteredResults={searchresults} onMarkerClick={scrollToResult} />
        </div>
  
        <div className="searchresults-container">
          <h1>Search Results</h1>
          <div className="searchresults-list">
            {searchresults.length > 0 ? (
              searchresults.map((result, index) => (
                <div
                  className="searchresults-card"
                  key={result.landlordId}
                  ref={(el) => (searchresultsRefs.current[index] = el)}
                  onClick={() => handleLandlordClick(result.landlordId)}
                >
                  <div className="searchresults-card-header">
                    <div className="searchresults-rating-box">
                      <span>Avg Rating</span>
                      <h3>{result.averageRating ? result.averageRating.toFixed(1) : 'No Rating'}</h3>
                      <p>{result.reviewCount} Reviews</p>
                    </div>
                    <div className="searchresults-landlord-info">
                      <h2>{result.name}</h2>
                      {result.properties?.map((property, idx) => (
                        <p key={idx}>{property.address}, {property.city}, {property.zipcode}</p>
                      )) || <p>No address available</p>}
                    </div>
                    <div
                      className="searchresults-bookmark-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(result.landlordId);
                      }}
                    >
                      <img
                        src={bookmarked[result.landlordId] ? SelectedBookmark : MyBookmark}
                        alt="Bookmark"
                        className="searchresults-bookmark-icon-img"
                      />
                    </div>
                  </div>
                  <div className="searchresults-card-body">
                    <p>{result.properties?.[0]?.propertyname || 'No property information available'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No results found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultsPage;
