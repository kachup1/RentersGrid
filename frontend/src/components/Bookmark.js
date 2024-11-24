import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Bookmark.module.css';
import OfficialLogo from '../Assets/official logo.svg';
import SavedBookmark from '../Assets/saved-bookmark.svg'; // Saved bookmark icon
import EmptyBookmark from '../Assets/my bookmark.svg'; // Empty bookmark icon
import InsideAccountSideMenu from './InsideAccountSideMenu';
import BackgroundLogo from '../Assets/3-ppl-icon.svg';

function Bookmark() {
  const [bookmarkedLandlords, setBookmarkedLandlords] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const [sortOption, setSortOption] = useState('');

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/'); // Redirect to the homepage after sign-out
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
    setLoading(true); // Show loading state
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
        setLoading(false); // Remove loading state
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ landlordId }),
    }).catch((error) => {
      setBookmarkedLandlords((prev) =>
        prev.map((landlord) =>
          landlord.landlordId === landlordId
            ? { ...landlord, isBookmarked } // Revert back to original state on error
            : landlord
        )
      );
      console.error('Error updating bookmark status:', error);
    });
  };

  if (loading) {
    return <div>Loading your bookmarked landlords...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error message
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedLandlords = [...bookmarkedLandlords].sort((a, b) => {
    if (sortOption === 'rating') {
      return b.averageRating - a.averageRating; // Highest rating first
    } else if (sortOption === 'lowest rating') {
      return a.averageRating - b.averageRating; // Lowest rating first
    } else if (sortOption === 'Landlord name') {
      return a.name.localeCompare(b.name); // Sort alphabetically by name
    } else if (sortOption === 'property name') {
      const propertyA = a.properties[0]?.propertyname || ''; // Fallback to empty string if propertyname is undefined
      const propertyB = b.properties[0]?.propertyname || '';
      return propertyA.localeCompare(propertyB); // Sort alphabetically by property name
    } else if (sortOption === 'reviews') {
      return b.reviewCount - a.reviewCount; // Most reviews first
    }
    return 0; // No sorting if no option selected
  });

  const refresh = () => {
    navigate('/bookmarks');
    window.location.reload();
  };

  return (
    <div className={styles['my-account-container']}>
      {/* Side Menu */}
      <InsideAccountSideMenu />
      <main className={styles["main-content"]}>
        {/* Background logo */}
        <img src={BackgroundLogo} alt="Background Logo" className={styles["background-logo"]} />
        {/* Header with icon and text */}
        <div className={styles['mybookmark-header']}>
          <img
            src={EmptyBookmark}
            alt="myBookmark Icon"
            className={styles['myheader-bookmark-icon']}
          />
          <h1>
            My <span className={styles['myhighlight-bookmarks']}>Bookmarks</span>
          </h1>
        </div>

        <div className={styles['mybookmark-search-container']}>
          <select
            className={styles['mybookmark-search-dropdown']}
            onChange={handleSortChange}
          >
            <option value="">Search By</option>
            <option value="rating">Highest Rating</option>
            <option value="Landlord name">Landlord Name</option>
            <option value="lowest rating">Lowest Rating</option>
            <option value="property name">Property Name</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>

        <div className={styles['mylandlord-list']}>
          {sortedLandlords.length > 0 ? (
            sortedLandlords.map((landlord) => (
              <div
                className={styles['mylandlord-card']}
                key={landlord.landlordId}
                onClick={() => navigate(`/LandlordProfile/${landlord.landlordId}`)}
              >
               <div className={styles['rating-container']}>
  <span className={styles['rating-label']}>Rating</span>
  <div className={styles['rating-box']}>
    <h2
      className={
        landlord.averageRating
          ? styles['rating-score']
          : styles['no-rating']
      }
    >
      {landlord.averageRating
        ? landlord.averageRating.toFixed(1)
        : 'No Rating'}
    </h2>
  </div>
  <p className={styles['rating-reviews']}>
    {landlord.reviewCount} {landlord.reviewCount === 1 ? 'Review' : 'Reviews'}
  </p>
</div>


                <div className={styles['mylandlord-info']}>
                  <h2>{landlord.name}</h2>
                  {landlord.properties && landlord.properties.length > 0 ? (
                    <>
                      {/* Display the first property or properties */}
                      {landlord.properties.slice(0, 1).map((property, index) => (
                        <p key={index}>
                          {property.propertyname
                            ? `${property.propertyname},`
                            : 'No Property Name,'}{' '}
                          {property.address}, {property.city}, {property.zipcode}
                        </p>
                      ))}

                      {/* Display the "+n more properties" if there are more */}
                      {landlord.properties.length > 1 && (
                        <p className="additional-properties">
                          +{landlord.properties.length - 1} more properties
                        </p>
                      )}
                    </>
                  ) : (
                    <p>No properties available</p>
                  )}
                </div>

                <div
                  className={styles['mybookmark-icon']}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    toggleBookmark(landlord.landlordId, landlord.isBookmarked);
                  }}
                >
                  <img
                    src={landlord.isBookmarked ? SavedBookmark : EmptyBookmark}
                    alt={
                      landlord.isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No bookmarked landlords found.</p>
          )}
        </div>
      </main>

    </div>
  );
}

export default Bookmark;
