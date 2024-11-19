import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchResultsMap from './SearchResultsMap';
import ClearSelectionIcon from '../Assets/clear-selection.svg';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MyBookmark from '../Assets/fav-unselect.svg';
import SelectedBookmark from '../Assets/saved-bookmark.svg';
import NoAccountSideMenu from './NoAccountSideMenu';
import SideMenu from './SideMenu';
import './SearchResults.css';
import { isTokenValid } from './authentication';

function SearchResultsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('landlord');
  const [sortBy, setSortBy] = useState('Landlord name');
  const [loading, setLoading] = useState(false);
  const [searchresults, setSearchResults] = useState([]);
  const searchresultsRefs = useRef([]);
  const [bookmarked, setBookmarked] = useState({});
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [lastSearchedQuery, setLastSearchedQuery] = useState(''); // New state for last searched query

  const navigate = useNavigate();
  const location = useLocation();
  const { results: fetchedResults } = location.state || {};
  const { results = [], searchQuery: initialQuery = '', searchBy = 'all' } = location.state || {};

  const refreshAndNavigate = () => {
    navigate('/');
    window.location.reload();
  };

  const fetchBookmarks = (token) => {
    fetch('http://localhost:5000/api/bookmarks', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(bookmarkedLandlords => {
        const updatedBookmarked = {};
        bookmarkedLandlords.forEach(landlordId => {
          updatedBookmarked[landlordId] = true;
        });
        setBookmarked(updatedBookmarked);
      })
      .catch(error => console.error('Error fetching bookmarks:', error));
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
  const handleClear = () => {
    setSearchQuery('');  // Clears the search query
    setSortBy('Landlord name');       // Clears the sort option
  };
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query.');
      return;
    }
    setLastSearchedQuery(searchQuery); // Store the current query as the last searched query
    setIsSearchTriggered(true); // Mark the search as triggered
    setLoading(true);
  
    fetch(`/api/search?searchBy=${searchType}&query=${encodeURIComponent(searchQuery)}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
        setLoading(false);
      });
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger the search on Enter
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSortBy(selectedSort);
    let sortedResults = [];

    if (selectedSort === 'Landlord name') {
      sortedResults = [...searchresults].sort((a, b) => {
        const [aFirstName, aLastName] = a.name.split(' ');
        const [bFirstName, bLastName] = b.name.split(' ');
        return (aLastName || aFirstName).localeCompare(bLastName || bFirstName);
      });
    } else if (selectedSort === 'highest rating') {
      sortedResults = [...searchresults].sort((a, b) => b.averageRating - a.averageRating);
    } else if (selectedSort === 'lowest rating') {
      sortedResults = [...searchresults].sort((a, b) => a.averageRating - b.averageRating);
    } else if (selectedSort === 'property name') {
      sortedResults = [...searchresults].sort((a, b) => (a.properties[0]?.propertyname || '').localeCompare(b.properties[0]?.propertyname || ''));
    } else if (selectedSort === 'reviews') {
      sortedResults = [...searchresults].sort((a, b) => b.reviewCount - a.reviewCount);
    }
    setSearchResults(sortedResults);
  };

  const formatName = (name) => {
    const [firstName, lastName] = name.split(' ');
    return lastName ? `${lastName}, ${firstName}` : name;
  };

  useEffect(() => {
  if (searchQuery === '' && initialQuery) {
    setSearchQuery(initialQuery); // Only set the query if it's empty initially
    setLastSearchedQuery(initialQuery);
  }
}, [initialQuery]);


  useEffect(() => {
    if (fetchedResults) {
      setSearchResults(fetchedResults);
    }
  }, [fetchedResults]);

  const handleLandlordClick = (landlordId) => {
    navigate(`/LandlordProfile/${landlordId}`);
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
            onClick={() => navigate(isTokenValid() ? '/myaccount' : '/signin')}
          />
        </div>
      </header>

      <div className="searchresults-searchby-and-sort-wrapper">
  <div className="searchresults-bar-container" style={{ position: 'relative', display: 'inline-block' }}>
    <select
      className="searchresults-dropdown"
      value={searchType}
      onChange={(e) => setSearchType(e.target.value)}
    >
      <option value="landlord">Landlord Name</option>
      <option value="property">Property Name</option>
      <option value="address">Address</option>
      <option value="city">City</option>
      <option value="zipcode">Zip Code</option>
    </select>
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder={`Search by ${searchType === 'landlord' ? 'Landlord Name' : searchType}`}
      className="searchresults-input"
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      style={{ paddingRight: '30px' }}
    />
    {searchQuery.trim() || sortBy ? (
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
        onClick={handleClear}
      />
    ) : null}
  </div>
  <div className="searchresults-sort-container">
    <label htmlFor="sort">Sort By: </label>
    <select
      id="sort"
      className="searchresults-sort-button"
      value={sortBy}
      onChange={handleSortChange}
    >
      <option value="highest rating">Highest Rating</option>
      <option value="Landlord name">Landlord Name</option>
      <option value="lowest rating">Lowest Rating</option>
      <option value="property name">Property Name</option>
      <option value="reviews">Most Reviews</option>
    </select>
  </div>
</div>


      <div className="searchresults-main-content">
        <div className="searchresults-map-container">
          <SearchResultsMap filteredResults={searchresults} onMarkerClick={(index) => searchresultsRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })} />
        </div>

        <div className="searchresults-container">
          <h1>Search Results for "{lastSearchedQuery|| ''}"</h1>
          <div className="searchresults-list">
          {!Array.isArray(searchresults) || searchresults.length === 0 ? (
    isSearchTriggered ? (
      // Case 2: No results found (only after Enter is pressed)
      <p>No results found.</p>
    ) : (
      // Case 1: Navigated without input
      <p></p>
    )
  ) : (
    // Case 3: Results found
    searchresults.map((result, index) => (
      <div
        className="searchresults-card"
        key={result.landlordId}
            ref={(el) => (searchresultsRefs.current[index] = el)} // Assign ref

        onClick={() => handleLandlordClick(result.landlordId)}
      >
        <div className="searchresults-card-header">
          <div className="searchresults-rating-box">
            <span>Avg Rating</span>
            <h3>{result.averageRating ? result.averageRating.toFixed(1) : 'No Rating'}</h3>
            <p>{result.reviewCount} Reviews</p>
          </div>
          <div className="searchresults-landlord-info">
            <h2>{formatName(result.name)}</h2>
            {result.properties?.map((property, idx) => (
              <p key={idx}>
                {property.address}, {property.city}, {property.zipcode}
              </p>
            ))}
          </div>
          <div
            className="bookmark-icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(result.landlordId);
            }}
          >
            <img
              src={bookmarked[result.landlordId] ? SelectedBookmark : MyBookmark}
              alt="Bookmark"
              className="bookmark-icon-img"
            />
          </div>
        </div>
      </div>
    ))
  )}
</div>

          </div>
        </div>
      </div>
  );
}

export default SearchResultsPage;
