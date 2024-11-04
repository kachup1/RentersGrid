import React, { useState } from 'react';
import './AddALandlord.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import NoAccountSideMenu from './NoAccountSideMenu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import home from '../Assets/home.svg'; // Example icons
import searchIcon from '../Assets/menu-1.svg';
import addLandlordIcon from '../Assets/menu-2.svg';
import signOutIcon from '../Assets/signout.svg';
import accountIcon from '../Assets/Account button.svg';
import myrating from '../Assets/my-rating.svg';
import myBookmark from '../Assets/my bookmark.svg'; // Empty bookmark icon
import addALandlord from '../Assets/add-a-landlord-title.svg';
import Triangle from '../Assets/triangle.svg';

function AddALandlord() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleSignOut = () => {
        localStorage.removeItem('token');  // Remove the token from localStorage
        navigate('/');  // Redirect to the homepage after sign-out
      };

    // States for managing state list visibility
    const [showStates, setShowStates] = useState(false);
    const [selectedState, setSelectedState] = useState('');
    const [nameType, setNameType] = useState('individual');
    const [showAddProperty, setShowAddProperty] = useState('false');

    // List of U.S. states
    const states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California",
        "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
        "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
        "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
        "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
        "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
        "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
        "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
        "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ];
    
    return (
        <div className="add-a-landlord-main-container">
            <header>
 
                    <img src={addALandlord} alt="OfficialLogo" className="add-a-landlord-center-logo"/>
                    <label className="add-a-landlord-center-logo-text">Add a Landlord</label>
                

                {/* Background Image */}
                <img src={SubmitLandlordRate} alt="background" className="add-a-landlord-background-image"/>

                {/* Left Image: Submit Landlord Rate */}
                <img src={SubmitLandlordRate} alt="Submit Landlord Rate" className="add-a-landlord-left-icon"/>

                {/* Right Image: Account Button */}
                <img src={AccountButton} alt="Account Button" className="add-a-landlord-right"/>

                

            </header>

            {/* Permanent side menu */}
            <div className="add-a-landlord-left-side-menu">
                <img src={require('../Assets/official logo.svg').default} alt="Logo" className="add-a-landlord-left-menu-logo" />

                <ul>
                <li>
                    {/* Homepage link */}
                    <Link to="/">
                    <img src={home} alt="Home" className="add-a-landlord-left-menu-icon" />
                    Homepage
                    </Link>
                </li>
                <li>
                    {/* Search link */}
                    <Link to="/SearchResults">
                    <img src={searchIcon} alt="Search" className="add-a-landlord-left-menu-icon" />
                    Search
                    </Link>
                </li>
                <li>
                    {/* Add Landlord link */}
                    <Link to="/add-landlord">
                    <img src={addLandlordIcon} alt="Add a Landlord" className="add-a-landlord-left-menu-icon" />
                    Add a Landlord
                    {/* Triangle to show where we are */}
                    <img src={Triangle} alt="Triangle" className="add-a-landlord-triangle"/>   
                    </Link>
                </li>
                <li>
                    {/* Sign Out link */}
                    <a href="#" onClick={handleSignOut}>
                    <img src={signOutIcon} alt="Sign Out" className="add-a-landlord-left-menu-icon" />
                    Sign Out
                    </a>
                </li>
                <li>
                    {/* My Account link */}
                    <Link to="/account">
                    <img src={accountIcon} alt="My Account" className="add-a-landlord-left-menu-icon" />
                    My Account
                    </Link>
                </li>
                <li>
                    {/* My Ratings link */}
                    <Link to="/ratings">
                    <img src={myrating} alt="Add a Landlord" className="add-a-landlord-left-menu-icon" />
                    My Ratings
                    </Link>
                </li>
                <li>
                    {/* My Bookmarks link */}
                    <Link to="/bookmarks">
                    <img src={myBookmark} alt="Add a Landlord" className="add-a-landlord-left-menu-icon" />
                    My Bookmarks
                
                    </Link>
                </li>
                </ul>
                </div>

            {/* Enter name */}
            <div className="add-a-landlord-input-box">
                <span className="icon">
                    <input
                        type="text"
                        className="add-a-landlord-name-box"
                        placeholder={nameType === 'individual' ? "First and Last Name" : "Company Name"}
                        required
                    />
                </span>
            </div>

            {/* Toggle button */}
            <div className="add-a-landlord-name-toggle-button">
                <button
                    type="button"
                    className={`add-a-landlord-toggle-button ${nameType === 'individual' ? 'add-a-landlord-toggle-button-active' : ''}`}
                    onClick={() => setNameType('individual')}
                >
                    Name
                </button>
                <button
                    className={`add-a-landlord-toggle-button ${nameType === 'company' ? 'add-a-landlord-toggle-button-active' : ''}`}
                    onClick={() => setNameType('company')}
                >
                    Company Name
                </button>
            </div>

            {/* Enter Property Name */}
            <div className="add-a-landlord-input-box">
                <span className="icon">
                    <input
                        type="text"
                        className="add-a-landlord-property-name-box"
                        required
                    />
                    <label className="add-a-landlord-property-name-text">Property Name:</label>
                </span>
            </div>

            {/* Property Address */}
            <div className="add-a-landlord-input-box">
                <span className="icon">
                    <input
                        type="text"
                        className="add-a-landlord-property-address-box"
                        placeholder="Street Address"
                        required
                    />
                    <label className="add-a-landlord-property-address-text">Property Address:</label>
                </span>
            </div>

            {/* City */}
            <div className="add-a-landlord-input-box">
                <span className="icon">
                    <input
                        type="text"
                        className="add-a-landlord-city-box"
                        required
                    />
                    <label className="add-a-landlord-city-text">City:</label>
                </span>
            </div>

            {/* State */}
            <div className="add-a-landlord-input-box">
                <label className="add-a-landlord-state-text">State:</label>
                <select
                    className="add-a-landlord-state-dropdown"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a State</option>
                    {states.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                    ))}
                </select>
            </div>

            {/* State List */}
            {showStates && (
                <div className="state-list">
                    <ul>
                        {states.map((state, index) => (
                            <li key={index}>{state}</li>
                        ))}
                    </ul>
                </div>
            )}


            {/* Zip Code */}
            <div className="add-a-landlord-input-box">
                <span className="icon">
                    <input
                        type="text"
                        className="add-a-landlord-zip-code"
                        required
                    />
                    <label className="add-a-landlord-zip-code-text">Zip Code:</label>
                </span>
            </div>

            {/* Add another property */}
            <div className="add-a-landlord-additional-property-container">
                <button
                    className="add-a-landlord-additional-property-button"
                    onClick={() => setShowAddProperty(prev => !prev)}
                >
                    {showAddProperty ? 'Hide Additional Property' : 'Add another property?'}
                </button>

                {showAddProperty && (
                    <div className="additional-property-form">
                        {/* Additional Property Name */}
                        <div className="add-a-landlord-additional-input-box">
                            <label className="add-a-landlord-additional-property-name-text">Property Name:</label>
                                <input
                                    type="text"
                                    className="add-a-landlord-additional-property-name-box"
                                    placeholder="Property Name"
                                    required
                                />
                            
                        </div>

                        {/* Additional Property Address */}
                        <div className="add-a-landlord-additional-input-box">
                            <label className="add-a-landlord-additional-property-address-text">Property Address:</label>
                                <input
                                    type="text"
                                    className="add-a-landlord-additional-property-address-box"
                                    placeholder="Street Address"
                                    required
                                />
                            
                        </div>

                        {/* Additional City */}
                        <div className="add-a-landlord-additional-input-box">
                        <label className="add-a-landlord-additional-city-text">City:</label>
                                <input
                                    type="text"
                                    className="add-a-landlord-additional-city-box"
                                    placeholder="City"
                                    required
                                />
                                
                            
                        </div>

                        {/* Additional State */}
                        <div className="add-a-landlord-additional-input-box">
                            <label className="add-a-landlord-additional-state-text">State:</label>
                            <select className="add-a-landlord-additional-state-dropdown" required>
                                <option value ="" disabled>Select a State</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        {/* Additional Zip Code */}
                        <div className="add-a-landlord-additional-input-box">
                                <label className="add-a-landlord-additional-zip-code-text">Zip Code:</label>
                                <input
                                    type="text"
                                    className="add-a-landlord-additional-zip-code-box"
                                    placeholder="Zip Code"
                                    required
                                />
                                
                            
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="add-a-landlord-submit-button">Submit Landlord</button>
        </div>
    );
}

export default AddALandlord;