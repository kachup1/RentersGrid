import React, { useState } from 'react';
import { Link,useNavigate  } from 'react-router-dom';
import home from '../Assets/home.svg'; // Example icons
import searchIcon from '../Assets/menu-1.svg';
import addLandlordIcon from '../Assets/menu-2.svg';
import signOutIcon from '../Assets/signout.svg';
import accountIcon from '../Assets/Account button.svg';
import myrating from '../Assets/my-rating.svg';
import myBookmark from '../Assets/my bookmark.svg'; // Empty bookmark icon
//import ratingsIcon from '../Assets/ratings-icon.svg';
//import bookmarksIcon from '../Assets/bookmarks-icon.svg';
import './SideMenu.css'; // Include CSS styles for the side menu

function SideMenu({ onSignOut }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the menu open/close state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleSignOut = () => {
    localStorage.removeItem('token');  // Remove the token from localStorage
    navigate('/');  // Redirect to the homepage after sign-out
  };

  return (
    <div>
      {/* Menu button */}
      <div className="menu-button" onClick={toggleMenu}>
        <span className="menu-icon">&#9776;</span>
      </div>

      {/* Side menu */}
          <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
              <button className="close-button" onClick={toggleMenu} >
                  <img src={require('../Assets/closebuttonforpopupmenu.svg').default} alt="close" className="close-icon" />
                  </button>
        <img src={require('../Assets/official logo.svg').default} alt="Logo" className="menu-logo" />
        <ul>
          <li>
            {/* Add navigation using Link for Homepage */}
            <Link to="/" onClick={toggleMenu}>
              <img src={home} alt="Home" className="menu-icon" />
              Homepage
            </Link>
          </li>
          <li>
            {/* Add navigation using Link for Search */}
            <Link to="/SearchResults" onClick={toggleMenu}>
              <img src={searchIcon} alt="Search" className="menu-icon" />
              Search
            </Link>
          </li>
          <li>
            {/* Add navigation using Link for Add a Landlord */}
            <Link to="/AddALandlord" onClick={toggleMenu}>
              <img src={addLandlordIcon} alt="Add a Landlord" className="menu-icon" />
              Add a Landlord
            </Link>
          </li>
          <li>
            <a href="/" onClick={(handleSignOut)} >
              <img src={signOutIcon} alt="Sign Out" className="menu-icon" />
              Sign Out
            </a>
          </li>
    
          <li>
            {/* Add navigation using Link for My Account */}
            <Link to="/myaccount" onClick={toggleMenu}>
              <img src={accountIcon} alt="My Account" className="menu-icon" />
              My Account
            </Link>
          </li>
          <li>
            {/* Add navigation using Link for My Ratings */}
            <Link to="/myratings" onClick={toggleMenu}>
            <img src={myrating} alt="My Account" className="menu-icon" />

              My Ratings
            </Link>
          </li>
          <li>
            {/* Add navigation using Link for My Bookmarks */}
            <Link to="/mybookmarks" onClick={toggleMenu}>
            <img src={myBookmark} alt="My Bookmark" className="menu-icon" />

              My Bookmarks
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideMenu;
