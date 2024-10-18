import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import Helvetica from '../fonts/Helvetica.ttf'; // Adjust path as necessary
import DownArrow from '../Assets/downward.svg'; // Make sure the path to the arrow is correct
import Map from '../components/Map';
import SideMenu from './NoAccountSideMenu'; // Import the SideMenu component
import './NoAccountHomepage.css';  // Create a CSS file for styling if needed
/*const HomePage = () => {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search-results?searchBy=${searchType}&query=${searchInput}`);
  };*/


// Function to refresh the page
const refreshPage = () => {
    window.location.reload();
}

function NoAccountHomePage() {
    const [selectedOption, setSelectedOption] = useState('landlord'); // Default option
    const [dropdownOpen, setDropdownOpen] = useState(false); // To toggle the dropdown
    const navigate = useNavigate();

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOptionSelect = (value) => {
        setSelectedOption(value);
        setDropdownOpen(false); // Close the dropdown after selection
    };

    //function to handle account button click
    const handleAccountButtonClick = () => {
        navigate('/signin'); //navigate to the sign in page
    }
    const options = [
        { value: 'landlord', label: 'Landlord Name' },
        { value: 'property', label: 'Property Name' },
        { value: 'address', label: 'Address' },
        { value: 'city', label: 'City' },
        { value: 'zipcode', label: 'Zip Code' },
    ];

    return (
        <div className="main-container">
            <SideMenu />

            <header className="headerhp">
                <div className="logohp-container">
                    <img
                        src={OfficialLogo}
                        alt="Official Logo"
                        onClick={refreshPage}
                        className="center-logo"
                    />
                </div>
                <div className="buttons-container">
                    {/* Left Image: Submit Landlord Rate */}
                    <img
                        src={SubmitLandlordRate}
                        alt="Submit Landlord Rate"
                        className="left-icon"
                    />

                    {/* Right Image: Account Button */}
                    <img
                        src={AccountButton}
                        alt="Account Button"
                        className="account-right"
                        onClick={handleAccountButtonClick} //This adds a click handler to account button
                    />
                </div>
            </header>

            {/* Search Menu */}
            <div className="search-bar-container">
                <div className="dropdown-container">
                    <div className="dropdown-selected" onClick={handleDropdownToggle}>
                        <span>{options.find(option => option.value === selectedOption)?.label}</span>
                        <img
                            src={DownArrow}
                            alt="Down Arrow"
                            className={`down-arrow ${dropdownOpen ? 'open' : ''}`} // Add a class to rotate the arrow when open
                        />
                    </div>

                    {dropdownOpen && (
                        <ul className="dropdown-options">
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => handleOptionSelect(option.value)}
                                    className={`dropdown-item ${selectedOption === option.value ? 'selected' : ''}`}
                                >
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <input
                    type="text"
                    placeholder={`Search by ${options.find(option => option.value === selectedOption)?.label}`} // Dynamic placeholder
                    className="search-input"
                />
            </div>

            <section className="map-section">
                <div className="map-container">
                    <Map />
                </div>
            </section>

        </div>
    );
}



export default  NoAccountHomePage;