import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchResultsMap from './SearchResultsMap';
import ClearSelectionIcon from '../Assets/clear-selection.svg';
import MyBookmark from '../Assets/fav-unselect.svg';
import SelectedBookmark from '../Assets/saved-bookmark.svg';
import Header from './Header';
import styles from './SearchResults.module.css';
import { isTokenValid } from './authentication';

import MainSearchButton from './MainSearchButton'; 
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const { results: fetchedResults } = location.state || {};
  const { results = [], searchQuery: initialQuery = '', searchBy = 'all' } = location.state || {};


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

    fetch('/api/bookmark', {
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
    <div className={styles['searchresults-page-container']}>
      <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
  
  
      {/* main contents */}
  <div className={styles['searchresults-searchby-and-sort-wrapper']}>
    {/* Search Bar */}
        <MainSearchButton
      onSearch={(data, query, searchBy) => {
        setSearchResults(data);
        setSearchQuery(query);
        setSearchType(searchBy);
      }}
    />

    {/* Sort Component */}
    <div className={styles['searchresults-sort-container']}>
      <label htmlFor="sort" className={styles['searchresults-sort-label']}>Sort By: </label>
      <select
        id="sort"
        className={styles['searchresults-sort-button']}
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

  {/* Results Container */}
  <div className={styles['searchresults-main-content']}>
    {/* Map Container */}
    <div className={styles['searchresults-map-container']}>
      <SearchResultsMap
        filteredResults={searchresults}
        onMarkerClick={(index) => searchresultsRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })}
      />
    </div>

    {/* Results List */}
    <div className={styles['searchresults-container']}>
      <h1>Search Results for "{lastSearchedQuery || ''}"</h1>
      <div className={styles['searchresults-list']}>
        {!Array.isArray(searchresults) || searchresults.length === 0 ? (
          isSearchTriggered ? (
            <p>No results found.</p>
          ) : (
            <p></p>
          )
        ) : (
          searchresults.map((result, index) => (
            <div
              className={styles['searchresults-card']}
              key={result.landlordId}
              ref={(el) => (searchresultsRefs.current[index] = el)}
              onClick={() => handleLandlordClick(result.landlordId)}
            >
              <div className={styles['searchresults-card-header']}>
                {/* Rating Box */}
                <div className={styles['rating-container']}>
                  <span className={styles['rating-label']}>Avg Rating</span>
                  <div className={styles['searchresults-rating-box']}>
                    <h2
                      className={
                        result.averageRating
                          ? styles['rating-score']
                          : styles['no-rating']
                      }
                    >
                      {result.averageRating
                        ? result.averageRating.toFixed(1)
                        : 'No Rating'}
                    </h2>
                  </div>
                  <p className={styles['rating-reviews']}>
                    {result.reviewCount} {result.reviewCount === 1 ? 'Review' : 'Reviews'}
                  </p>
                </div>

                {/* Landlord Info */}
                <div className={styles['searchresults-landlord-info']}>
                  <h2>{formatName(result.name)}</h2>
                  {result.properties && result.properties.length > 0 && (
                    <>
                      <p>
                        {result.properties[0].address}, {result.properties[0].city}, {result.properties[0].zipcode}
                      </p>
                      {result.properties.length > 1 && (
                        <p className={styles['additional-properties']}>
                          +{result.properties.length - 1} more properties
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Bookmark Icon */}
                <div
                  className={styles['searchresults-bookmark-icon']}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(result.landlordId);
                  }}
                >
                  <img
                    src={bookmarked[result.landlordId] ? SelectedBookmark : MyBookmark}
                    alt="Bookmark"
                    className={styles['searchresults-bookmark-icon-img']}
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
