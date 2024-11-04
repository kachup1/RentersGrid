
import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import { isTokenValid } from './authentication';  // Import token utility

import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import Helvetica from '../fonts/Helvetica.ttf'; // Adjust path as necessary
import DownArrow from '../Assets/downward.svg'; // Make sure the path to the arrow is correct
import Map from '../components/Map';
import SideMenu from './SideMenu';  // Import the logged-in side menu
import NoAccountSideMenu from './NoAccountSideMenu';  // Import the logged-out side menu

import './NoAccountHomepage.css';  // Create a CSS file for styling if needed
// Function to refresh the page
const refreshPage = () => {
    window.location.reload();
}

function NoAccountHomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    setIsLoggedIn(isTokenValid());
  }, []);
    const [selectedOption, setSelectedOption] = useState('landlord'); // Default option
    const [dropdownOpen, setDropdownOpen] = useState(false); // To toggle the dropdown
    const [searchInput, setSearchInput] = useState(''); // Track the search input\

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
    const handleSearch = () => {
        console.log('Search button clicked!'); // Log when search starts

        if (searchInput.trim()) {
            console.log('Fetching data from API...'); // Log before the fetch request

            // Make the API call to your Flask back-end
            fetch(`http://localhost:5000/api/search?searchBy=${selectedOption}&query=${encodeURIComponent(searchInput)}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Received search results:', data); // Log the search results received from the API

                    // Navigate to the SearchResults page with the results in the state
                    navigate('/SearchResults', { state: { results: data } });
                })
                .catch(error => {
                    console.error('Error fetching search results:', error); // Log any errors encountered during the fetch
                });
        } else {

            alert("Please enter a search query.");
        }
    };
    // Function to detect Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(); // Trigger search on Enter key press
        }
    };

    const options = [
        { value: 'landlord', label: 'Landlord Name' },
        { value: 'property', label: 'Property Name' },
        { value: 'address', label: 'Address' },
        { value: 'city', label: 'City' },
        { value: 'zipcode', label: 'Zip Code' },
    ];

    return (
        <div className="main-container">
      {isLoggedIn ? <SideMenu /> : <NoAccountSideMenu />}
            <header className="headerhp">
                <div className="main-logo">
                    <img
                        src={OfficialLogo}
                        alt="Official Logo"
                        onClick={refreshPage}
                    />
                </div>
                <div className="buttons-container">
                    {/* Left Image: Submit Landlord Rate */}
                    <img
                        src={SubmitLandlordRate}
                        alt="Submit Landlord Rate"
                        className="noc-left-icon"
                        onClick={() => navigate('/AddLandlord')}
                    />

                    {/* Right Image: Account Button */}
                    <img
                        src={AccountButton}
                        alt="Account Button"
                        className="noc-right-icon" // Adjusted class name
                        onClick={() =>{ 
                            if (isTokenValid()) {
                            navigate('/myaccount');  // Navigate to "My Account" if logged in
                          } else {
                            navigate('/signin');  // Navigate to "Sign In" if not logged in
                          }
                        }} // Directly use navigate in the onClick
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
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)} // Update search input on change
                    onKeyDown={handleKeyDown} // Detect Enter key press
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
export default NoAccountHomePage;