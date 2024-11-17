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

  const navigate = useNavigate();
  const location = useLocation();
  const { results: fetchedResults } = location.state || {};

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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query.');
      return;
    }

    setLoading(true);
    fetch(`/api/search?searchBy=${searchType}&query=${encodeURIComponent(searchQuery)}`)
      .then(response => response.json())
      .then(data => {
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
        <div className="searchresults-bar-container">
          <select className="searchresults-dropdown" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="landlord">Landlord Name</option>
            <option value="property">Property Name</option>
            <option value="address">Address</option>
            <option value="city">City</option>
            <option value="zipcode">Zip Code</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search by ${searchType === 'landlord' ? 'Landlord Name' : searchType}`}
            className="searchresults-input"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="searchresults-sort-container">
          <label htmlFor="sort">Sort By: </label>
          <select id="sort" className="searchresults-sort-button" value={sortBy} onChange={handleSortChange}>
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
          <h1>Search Results</h1>
          <div className="searchresults-list">
            {searchresults.length > 0 ? (
              searchresults.map((result, index) => (
                <div className="searchresults-card" key={result.landlordId} onClick={() => handleLandlordClick(result.landlordId)}>
                  <div className="searchresults-card-header">
                    <div className="searchresults-rating-box">
                      <span>Avg Rating</span>
                      <h3>{result.averageRating ? result.averageRating.toFixed(1) : 'No Rating'}</h3>
                      <p>{result.reviewCount} Reviews</p>
                    </div>
                    <div className="searchresults-landlord-info">
                      <h2>{formatName(result.name)}</h2>
                      {result.properties?.map((property, idx) => (
                        <p key={idx}>{property.address}, {property.city}, {property.zipcode}</p>
                      ))}
                    </div>
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
