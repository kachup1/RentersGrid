import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Bookmark.module.css';
import SavedBookmark from '../Assets/saved-bookmark.svg';
import RemoveBookmark from '../Assets/fav-unselect.svg';
import InsideAccountSideMenu from './InsideAccountSideMenu';
import BackgroundLogo from '../Assets/3-ppl-icon.svg';

import MyBookmark from '../Assets/fav-selected.svg';
import RightButtons from './RightButtons';

function Bookmark() {
  const [bookmarkedLandlords, setBookmarkedLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState('Most Reviews'); // Default displayed option
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility


  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please sign in to view bookmarks.');
      setLoading(false);
      return;
    }
    fetchBookmarkedLandlords(token);
  }, []);

  const fetchBookmarkedLandlords = (token) => {
    setLoading(true);
    fetch('/api/bookmarked-landlords', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((landlord) => ({
          ...landlord,
          isBookmarked: true,
        }));
        setBookmarkedLandlords(updatedData);
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch bookmarks. Please sign out then sign in again.');
        setLoading(false);
        console.error('Error fetching bookmarks:', error);
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ landlordId }),
    }).catch((error) => {
      console.error('Error toggling bookmark:', error);
      setBookmarkedLandlords((prev) =>
        prev.map((landlord) =>
          landlord.landlordId === landlordId
            ? { ...landlord, isBookmarked }
            : landlord
        )
      );
    });
  };

  // sorting stuff
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleSortChange = (option) => {
    setSortOption(option); // Update the sort option
    setIsDropdownOpen(false); // Close the dropdown
  };

  const sortedLandlords = [...bookmarkedLandlords].sort((a, b) => {
    if (sortOption === 'Highest Rating') {
      return b.averageRating - a.averageRating;
    } else if (sortOption === 'Lowest Rating') {
      return a.averageRating - b.averageRating;
    } else if (sortOption === 'Landlord Name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'Property Name') {
      const propertyA = a.properties[0]?.propertyname || '';
      const propertyB = b.properties[0]?.propertyname || '';
      return propertyA.localeCompare(propertyB);
    } else if (sortOption === 'Most Reviews') {
      return b.reviewCount - a.reviewCount;
    }
    return 0;
  });

  // Show property names in capitalized case like "my name" to "My Name"
const capitalizeCase = (str) => {
  if (!str) return ''; // Handle null or undefined
  return str
      .toLowerCase() // Convert to lowercase
      .split(' ') // Split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(' '); // Join the words back
};

  return (
    <div className={styles['my-container']}>
      <InsideAccountSideMenu />
      <img src={BackgroundLogo} alt="Background Logo" className={styles['background-logo']} />
      <main className={styles['main-content']}>
        <div className={styles['title-container']}>
          <img src={MyBookmark} alt="Account" className={styles.titleicon} />
          <h2>My Bookmarks</h2>
        </div>

        <div className={styles['main-contents']}>
          {/* Sorting Dropdown */}
          {bookmarkedLandlords.length > 0 && (
          <div className={styles['sorting-wrapper']}>
            <span className={styles['sort-label']}>Sort By:</span>
            <div className={styles['sorting-container']}>
              <div className={styles['sort-header']} onClick={toggleDropdown}>
                {sortOption}
              </div>
              {isDropdownOpen && (
                <ul className={styles['sort-options']}>
                  {['Landlord Name', 'Property Name', 'Highest Rating', 'Lowest Rating', 'Most Reviews'].map(
                    (option) => (
                      <li
                        key={option}
                        className={styles['sort-option']}
                        onClick={() => handleSortChange(option)}
                      >
                        {option}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

          {/* Bookmarks */}
          {loading ? (
            <p className={styles.loadingText}>Loading Bookmarks...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : sortedLandlords.length > 0 ? (
            sortedLandlords.map((landlord) => (
              <div
                className={styles['landlord-card']}
                key={landlord.landlordId}
                onClick={() => navigate(`/LandlordProfile/${landlord.landlordId}`)}
              >
                <div className={styles['left-box']}>
                  <div className={styles['rating-container']}>
                    <span className={styles['rating-label']}>Avg Rating</span>
                    <div className={styles['rating-box']}>
                      <h2 className={styles['rating-score']}>
                        {landlord.averageRating ? landlord.averageRating.toFixed(1) : 'N/A'}
                      </h2>
                    </div>
                    <p className={styles['rating-reviews']}>
                      {landlord.reviewCount} {landlord.reviewCount === 1 ? 'Review' : 'Reviews'}
                    </p>
                  </div>
                </div>
                <div className={styles['center-box']}>
                  <h2 className={styles['landlord-name']}>{landlord.name}</h2>
                  {landlord.properties && landlord.properties.length > 0 ? (
                    <div className={styles['property-list']}>
                      {landlord.properties.slice(0, 1).map((property, index) => (
                        <p key={index} className={styles['property-item']}>
                        {capitalizeCase(property.propertyname) || 'Unnamed Property'} –{' '}
                        {property.address || 'Unknown Address'}, {property.city || 'Unknown City'}
                    </p>
                      ))}
                         {landlord.properties.length > 1 && (
                      <p className={styles['property-item']}>
                          + {landlord.properties.length - 1} More Properties
                      </p>
                  )}
                    </div>
                  ) : (
                    <p>No properties available</p>
                  )}
                </div>
                <div className={styles['right-box']}>
                  <div
                    className={styles['bookmark-icon']}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(landlord.landlordId, landlord.isBookmarked);
                    }}
                  >
                    <img
                      src={landlord.isBookmarked ? SavedBookmark : RemoveBookmark}
                      alt="Bookmark Icon"
                      className={styles['bookmark-image']}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noBookmarksText}>No bookmarks yet? Discover great landlords and save them here.</p>
          )}
        </div>
      </main>
         {/* Top-Right Icons */}
         <div className={styles["right-buttons"]}>
                    <RightButtons />
                </div>
    </div>
  );
}

export default Bookmark;
