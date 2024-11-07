import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Bookmark.css';
import OfficialLogo from '../Assets/official logo.svg';
import SavedBookmark from '../Assets/saved-bookmark.svg'; // Saved bookmark icon
import EmptyBookmark from '../Assets/my bookmark.svg'; // Empty bookmark icon
import home from '../Assets/home.svg';
import searchIcon from '../Assets/menu-1.svg';
import addLandlordIcon from '../Assets/menu-2.svg';
import signOutIcon from '../Assets/signout.svg';
import accountIcon from '../Assets/Account button.svg';
import myrating from '../Assets/my-rating.svg';
import myBookmark from '../Assets/my bookmark.svg';
import bookmarkpeopleicon from '../Assets/people icon.svg';

function Bookmark() {
  const [bookmarkedLandlords, setBookmarkedLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState('');

  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view bookmarks.');
      setLoading(false);
      return;
    }
    fetchBookmarkedLandlords(token);
  }, []);

  const fetchBookmarkedLandlords = (token) => {
    setLoading(true);
    fetch('/api/bookmarked-landlords', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((landlord) => ({
          ...landlord,
          isBookmarked: true
        }));
        setBookmarkedLandlords(updatedData);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching bookmarked landlords.');
        setLoading(false);
        console.error('Error fetching bookmarked landlords:', error);
      });
  };

  const toggleBookmark = (landlordId, isBookmarked) => {
    const token = localStorage.getItem('token');
    const method = isBookmarked ? 'DELETE' : 'POST';

    setBookmarkedLandlords((prev) =>
      prev.map((landlord) =>
        landlord.landlordId === landlordId
          ? { ...landlord, isBookmarked: !isBookmarked }
          : landlord
      )
    );

    fetch('/api/bookmark', {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ landlordId })
    }).catch((error) => {
      setBookmarkedLandlords((prev) =>
        prev.map((landlord) =>
          landlord.landlordId === landlordId
            ? { ...landlord, isBookmarked }
            : landlord
        )
      );
      console.error('Error updating bookmark status:', error);
    });
  };

  if (loading) {
    return <div>Loading your bookmarked landlords...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedLandlords = [...bookmarkedLandlords].sort((a, b) => {
    if (sortOption === 'rating') {
      return b.averageRating - a.averageRating;
    } else if (sortOption === 'lowest rating') {
      return a.averageRating - b.averageRating;
    } else if (sortOption === 'Landlord name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'property name') {
      const propertyA = a.properties[0]?.propertyname || "";
      const propertyB = b.properties[0]?.propertyname || "";
      return propertyA.localeCompare(propertyB);
    } else if (sortOption === 'reviews') {
      return b.reviewCount - a.reviewCount;
    }
    return 0;
  });

  return (
    <div className="mybookmark-page">
      <div className="mybookmark-header">
        <img src={EmptyBookmark} alt="myBookmark Icon" className="myheader-bookmark-icon" />
        <h1>
          My <span className="myhighlight-bookmarks">Bookmarks</span>
        </h1>
      </div>

      <div className="mybookmark-search-container">
        <select className="mybookmark-search-dropdown" onChange={handleSortChange}>
          <option value="">Search By</option>
          <option value="rating">Highest Rating</option>
          <option value="Landlord name">Landlord Name</option>
          <option value="lowest rating">Lowest Rating</option>
          <option value="property name">Property Name</option>
          <option value="reviews">Most Reviews</option>
        </select>
      </div>

      <div className="sidebar">
        <img src={OfficialLogo} alt="Renters Grid Logo" className="sidebar-logo" onClick={() => navigate('/')} />
        <div className="menu-item" onClick={() => navigate('/home')}>
          <img src={home} alt="Homepage Icon" />
          <span>Homepage</span>
        </div>
        <div className="menu-item" onClick={() => navigate('/SearchResults')}>
          <img src={searchIcon} alt="Search Icon" />
          <span>Search</span>
        </div>
        <div className="menu-item" onClick={() => navigate('/add-landlord')}>
          <img src={addLandlordIcon} alt="Add a Landlord Icon" />
          <span>Add a Landlord</span>
        </div>
        <div className="menu-item" onClick={handleSignOut}>
          <img src={signOutIcon} alt="Sign Out Icon" />
          <span>Sign Out</span>
        </div>
        <div className="menu-item" onClick={() => navigate('/account')}>
          <img src={accountIcon} alt="Account Icon" />
          <span>My Account</span>
        </div>
        <div className="menu-item" onClick={() => navigate('/my-ratings')}>
          <img src={myrating} alt="Ratings Icon" />
          <span>My Ratings</span>
        </div>
        <div className="menu-item" onClick={() => navigate('/my-bookmarks')}>
          <img src={myBookmark} alt="Bookmarks Icon" />
          <span>My Bookmarks</span>
        </div>
      </div>

      <div className="content-container">
        <img src={bookmarkpeopleicon} alt="Background" className="bookmark-background-image" />
        <div className="mylandlord-list">
          {sortedLandlords.length > 0 ? (
            sortedLandlords.map((landlord) => (
              <div className="mylandlord-card" key={landlord.landlordId} onClick={() => navigate(`/LandlordProfile/${landlord.landlordId}`)}>
                <div className="myrating-box">
                  <h2>{landlord.averageRating ? landlord.averageRating.toFixed(1) : 'No Rating'}</h2>
                  <span>Rating</span>
                  <p>{landlord.reviewCount} Reviews</p>
                </div>
                <div className="mylandlord-info">
                  <h2>{landlord.name}</h2>
                  {landlord.properties && landlord.properties.length > 0 ? (
                    landlord.properties.map((property, index) => (
                      <p key={index}>
                        {property.propertyname ? `${property.propertyname},` : 'No Property Name,'} {property.address}, {property.city}, {property.zipcode}
                      </p>
                    ))
                  ) : (
                    <p>No properties available</p>
                  )}
                </div>
                <div
                  className="mybookmark-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(landlord.landlordId, landlord.isBookmarked);
                  }}
                >
                  <img
                    src={landlord.isBookmarked ? SavedBookmark : EmptyBookmark}
                    alt={landlord.isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No bookmarked landlords found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bookmark;
