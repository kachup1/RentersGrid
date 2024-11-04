<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './Bookmark.css';
import OfficialLogo from '../Assets/official logo.svg';
import SavedBookmark from '../Assets/saved-bookmark.svg'; // Saved bookmark icon
import EmptyBookmark from '../Assets/my bookmark.svg'; // Empty bookmark icon
import home from '../Assets/home.svg'; // Example icons
import searchIcon from '../Assets/menu-1.svg';
import addLandlordIcon from '../Assets/menu-2.svg';
import signOutIcon from '../Assets/signout.svg';
import accountIcon from '../Assets/Account button.svg';
import myrating from '../Assets/my-rating.svg';
import myBookmark from '../Assets/my bookmark.svg'; // Empty bookmark icon

function Bookmark() {
  const [bookmarkedLandlords, setBookmarkedLandlords] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const [sortOption, setSortOption] = useState('');

  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem('token');  // Remove the token from localStorage
    navigate('/');  // Redirect to the homepage after sign-out
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ landlordId })
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
      const propertyA = a.properties[0]?.propertyname || ""; // Fallback to empty string if propertyname is undefined
      const propertyB = b.properties[0]?.propertyname || "";
      return propertyA.localeCompare(propertyB); // Sort alphabetically by property name
    } else if (sortOption === 'reviews') {
      return b.reviewCount - a.reviewCount; // Most reviews first
    }
    return 0; // No sorting if no option selected
  });
  
  return (
    <div className="mybookmark-page">
      {/* Header with icon and text */}
      <div className="mybookmark-header">
        <img src={EmptyBookmark} alt="myBookmark Icon" className="myheader-bookmark-icon" />
        <h1>
          My <span className="myhighlight-bookmarks">Bookmarks</span>
        </h1>
      </div>

      <div className="mybookmark-search-container">
      <select
          className="mybookmark-search-dropdown"
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
      <div className="mybookmark-left-menu-container">
  {/* Permanent side menu */}
  <div className="mybookmark-left-side-menu">
    <img src={require('../Assets/official logo.svg').default} alt="Logo" className="mybookmark-left-menu-logo" />

    <ul>
      <li>
        {/* Homepage link */}
        <Link to="/">
          <img src={home} alt="Home" className="mybookmark-left-menu-icon" />
          Homepage
        </Link>
      </li>
      <li>
        {/* Search link */}
        <Link to="/SearchResults">
          <img src={searchIcon} alt="Search" className="mybookmark-left-menu-icon" />
          Search
        </Link>
      </li>
      <li>
        {/* Add Landlord link */}
        <Link to="/add-landlord">
          <img src={addLandlordIcon} alt="Add a Landlord" className="mybookmark-left-menu-icon" />
          Add a Landlord
        </Link>
      </li>
      <li>
        {/* Sign Out link */}
        <a href="#" onClick={handleSignOut}>
          <img src={signOutIcon} alt="Sign Out" className="mybookmark-left-menu-icon" />
          Sign Out
        </a>
      </li>
      <li>
        {/* My Account link */}
        <Link to="/account">
          <img src={accountIcon} alt="My Account" className="mybookmark-left-menu-icon" />
          My Account
        </Link>
      </li>
      <li>
        {/* My Ratings link */}
        <Link to="/ratings">
        <img src={myrating} alt="Add a Landlord" className="mybookmark-left-menu-icon" />
          My Ratings
        </Link>
      </li>
      <li>
        {/* My Bookmarks link */}
        <Link to="/bookmarks">
        <img src={myBookmark} alt="Add a Landlord" className="mybookmark-leftmenu-icon my-bookmark-icon" />
          My Bookmarks
        </Link>
      </li>
    </ul>
  </div>
</div>


      <div className="mylandlord-list">
        {sortedLandlords.length > 0 ? (
          sortedLandlords.map((landlord) => (
            <div
              className="mylandlord-card"
              key={landlord.landlordId}
              onClick={() => navigate(`/LandlordProfile/${landlord.landlordId}`)}
            >
              <div className="myrating-box">
                <h3>{landlord.averageRating ? landlord.averageRating.toFixed(1) : 'No Rating'}</h3>
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
                  e.stopPropagation(); // Prevent card click event
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
  );
}

export default Bookmark;
=======
import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './Bookmark.css';
import OfficialLogo from '../Assets/official logo.svg';
import SavedBookmark from '../Assets/saved-bookmark.svg'; // Saved bookmark icon
import EmptyBookmark from '../Assets/my bookmark.svg'; // Empty bookmark icon
import home from '../Assets/home.svg'; // Example icons
import searchIcon from '../Assets/menu-1.svg';
import addLandlordIcon from '../Assets/menu-2.svg';
import signOutIcon from '../Assets/signout.svg';
import accountIcon from '../Assets/Account button.svg';
import myrating from '../Assets/my-rating.svg';
import myBookmark from '../Assets/my bookmark.svg'; // Empty bookmark icon
import triangle from '../Assets/triangle.svg';
function Bookmark() {
  const [bookmarkedLandlords, setBookmarkedLandlords] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const [sortOption, setSortOption] = useState('');

  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem('token');  // Remove the token from localStorage
    navigate('/');  // Redirect to the homepage after sign-out
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ landlordId })
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
      const propertyA = a.properties[0]?.propertyname || ""; // Fallback to empty string if propertyname is undefined
      const propertyB = b.properties[0]?.propertyname || "";
      return propertyA.localeCompare(propertyB); // Sort alphabetically by property name
    } else if (sortOption === 'reviews') {
      return b.reviewCount - a.reviewCount; // Most reviews first
    }
    return 0; // No sorting if no option selected
  });
  
  return (
    <div className="mybookmark-page">
      {/* Header with icon and text */}
      <div className="mybookmark-header">
        <img src={EmptyBookmark} alt="myBookmark Icon" className="myheader-bookmark-icon" />
        <h1>
          My <span className="myhighlight-bookmarks">Bookmarks</span>
        </h1>
      </div>

      <div className="mybookmark-search-container">
      <select
          className="mybookmark-search-dropdown"
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
      <div className="mybookmark-left-menu-container">
  {/* Permanent side menu */}
  <div className="mybookmark-left-side-menu">
    <img src={require('../Assets/official logo.svg').default} alt="Logo" className="mybookmark-left-menu-logo" />

    <ul>
      <li>
        {/* Homepage link */}
        <Link to="/">
          <img src={home} alt="Home" className="mybookmark-left-menu-icon" />
          Homepage
        </Link>
      </li>
      <li>
        {/* Search link */}
        <Link to="/SearchResults">
          <img src={searchIcon} alt="Search" className="mybookmark-left-menu-icon" />
          Search
        </Link>
      </li>
      <li>
        {/* Add Landlord link */}
        <Link to="/add-landlord">
          <img src={addLandlordIcon} alt="Add a Landlord" className="mybookmark-left-menu-icon" />
          Add a Landlord
        </Link>
      </li>
      <li>
        {/* Sign Out link */}
        <a href="#" onClick={handleSignOut}>
          <img src={signOutIcon} alt="Sign Out" className="mybookmark-left-menu-icon" />
          Sign Out
        </a>
      </li>
      <li>
        {/* My Account link */}
        <Link to="/account">
          <img src={accountIcon} alt="My Account" className="mybookmark-left-menu-icon" />
          My Account
        </Link>
      </li>
      <li>
        {/* My Ratings link */}
        <Link to="/ratings">
        <img src={myrating} alt="Add a Landlord" className="mybookmark-left-menu-icon" />
          My Ratings
        </Link>
      </li>
      <li>
        {/* My Bookmarks link */}
        <Link to="/bookmarks">
        <img src={myBookmark} alt="Add a Landlord" className="mybookmark-leftmenu-icon my-bookmark-icon" />
          My Bookmarks
          <img src={require('../Assets/triangle.svg').default} alt="Triangle Icon" className="triangle-icon" />
        </Link>
      </li>
    </ul>
  </div>
</div>


      <div className="mylandlord-list">
        {sortedLandlords.length > 0 ? (
          sortedLandlords.map((landlord) => (
            <div
              className="mylandlord-card"
              key={landlord.landlordId}
              onClick={() => navigate(`/LandlordProfile/${landlord.landlordId}`)}
            >
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
                  e.stopPropagation(); // Prevent card click event
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
  );
}

export default Bookmark;
>>>>>>> francisco-b
