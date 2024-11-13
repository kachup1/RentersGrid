import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import home from '../Assets/home.svg'; // Example icons
import searchIcon from '../Assets/menu-1.svg';

import addLandlordIcon from '../Assets/menu-2.svg';
import signIn from '../Assets/signin signup.svg';
import './NoAccountSideMenu.css'; // Include CSS styles for the side menu


function SideMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle the menu open/close state
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            {/* Menu button */}
            <button className="menu-button" onClick={toggleMenu}>
                <img src={require('../Assets/menu-bar.svg').default} alt="menuBar" className="menu-bar" />
            </button>

            {/* Side menu */}
            <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
                <button className="close-button" onClick={toggleMenu} >
                    <img src={require('../Assets/closebuttonforpopupmenu.svg').default} alt="close" className="close-icon" />
                </button>
                <img src={require('../Assets/people icon.svg').default} alt="Logo" className="menu-logo" />
                <ul>
                    <li>
                        {/* Add navigation using Link for Homepage */}
                        <Link to="/" onClick={toggleMenu}>
                            <img src={home} alt="Home" className="menu-homepage" />
                            <span className="menu-text">Homepage</span>
                        </Link>
                    </li>
                    <li>
                        {/* Add navigation using Link for Search */}
                        <Link to="/SearchResults" onClick={toggleMenu}>
                            <img src={searchIcon} alt="Search" className="menu-search" />
                            <span className="menu-text">Search</span>
                        </Link>
                    </li>
                    <li>
                        {/* Add navigation using Link for Add a Landlord */}
                        <Link to="/AddALandlord" onClick={toggleMenu}>
                            <img src={addLandlordIcon} alt="Add a Landlord" className="menu-add" />
                            <span className="menu-text">Add a Landlord </span>
                        </Link>
                    </li>
                   
                    <li>
                        {/* Add navigation using Link for Sign in page */}
                        <Link to="/SignIn" onClick={toggleMenu}>
                            <img src={signIn} alt="Sign in/Sign up" className="menu-sign" />
                            <span className="menu-text">Sign In / Sign</span>
                        </Link>
                    </li>
                    
                </ul>
            </div>
        </div>
    );
}

export default SideMenu;
