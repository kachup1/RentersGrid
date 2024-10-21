import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import home from '../Assets/home.svg'; // Example icons
import searchIcon from '../Assets/menu-1.svg';
import addLandlordIcon from '../Assets/menu-2.svg';
import signOutIcon from '../Assets/menu-3.svg';
import accountIcon from '../Assets/Account button.svg';
//import ratingsIcon from '../Assets/ratings-icon.svg';
//import bookmarksIcon from '../Assets/bookmarks-icon.svg';
import './SideMenu.css'; // Include CSS styles for the side menu
import { useNavigate } from 'react-router-dom';

function SideMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate;

  // Toggle the menu open/close state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/');
  };

  return (
    <div>
      {/* Menu button */}
      <div className="menu-button" onClick={toggleMenu}>
      <img src={require('../Assets/menu-bar.svg').default} alt="menuBar" className="menu-bar" />
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
            <Link to="/add-landlord" onClick={toggleMenu}>
              <img src={addLandlordIcon} alt="Add a Landlord" className="menu-icon" />
              Add a Landlord
            </Link>
          </li>
          <li>
            {/* Add navigation using Link for Sign Out */}
            <Link to="#" onClick={handleSignOut}>
              <img src={signOutIcon} alt="Sign Out" className="menu-icon" />
              Sign Out
            </Link>
          </li>
    
          <li>
            {/* Add navigation using Link for My Account */}
            <Link to="/account" onClick={toggleMenu}>
              <img src={accountIcon} alt="My Account" className="menu-icon" />
              My Account
            </Link>
          </li>
          <li>
            {/* Add navigation using Link for My Ratings */}
            <Link to="/ratings" onClick={toggleMenu}>
              My Ratings
            </Link>
          </li>
          <li>
            {/* Add navigation using Link for My Bookmarks */}
            <Link to="/bookmarks" onClick={toggleMenu}>
              My Bookmarks
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideMenu;