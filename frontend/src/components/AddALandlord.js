import React, { useState, useEffect } from 'react';
import './AddALandlord.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import NoAccountSideMenu from './NoAccountSideMenu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import home from '../Assets/home.svg';
import searchIcon from '../Assets/menu-1.svg';
import addLandlordIcon from '../Assets/menu-2.svg';
import signOutIcon from '../Assets/signout.svg';
import accountIcon from '../Assets/Account button.svg';
import myrating from '../Assets/my-rating.svg';
import myBookmark from '../Assets/my bookmark.svg';
import addALandlord from '../Assets/add-a-landlord-title.svg';
import Triangle from '../Assets/triangle.svg';
import axios from 'axios';
import SideMenu from './SideMenu';  // Import the logged-in side menu
import { getUserIdFromToken, isTokenValid } from './authentication';

function AddALandlord() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const [name, setName] = useState('');
    const [propertyName, setPropertyName] = useState('');
    const [propertyAddress, setPropertyAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [nameType, setNameType] = useState('individual');
    const [showAddProperty, setShowAddProperty] = useState(false);

    const [additionalPropertyName, setAdditionalPropertyName] = useState('');
    const [additionalPropertyAddress, setAdditionalPropertyAddress] = useState('');
    const [additionalCity, setAdditionalCity] = useState('');
    const [additionalState, setAdditionalState] = useState('');
    const [additionalZipCode, setAdditionalZipCode] = useState('');
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [additionalAddressSuggestions, setAdditionalAddressSuggestions] = useState([]); // For additional property suggestions

    useEffect(() => {
        setIsLoggedIn(isTokenValid());
        console.log("User ID:", getUserIdFromToken());

    }, []);

    useEffect(() => {
        console.log("User ID:", getUserIdFromToken());
    }, []); // This will run once when the component mounts

    const states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
        "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
        "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
        "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
        "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
        "Wisconsin", "Wyoming"
    ];

    const handleAddressInputChange = async (e) => {
        const input = e.target.value;
        setPropertyAddress(input);

        if (input.length > 2) {
            try {
                const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json`, {
                    params: {
                        access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
                        types: 'address',
                        autocomplete: true,
			country: 'us'           // Restrict search to the USA

                    }
                });

                console.log("Mapbox API Response:", response.data.features);
                setAddressSuggestions(response.data.features);
            } catch (error) {
                console.error("Error fetching address suggestions:", error);
            }
        } else {
            setAddressSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const fullAddress = suggestion.place_name || suggestion.text;
        const [streetAddress] = fullAddress.split(',');
        setPropertyAddress(streetAddress);

        const city = suggestion.context.find(c => c.id.includes('place'))?.text || '';
        const state = suggestion.context.find(c => c.id.includes('region'))?.text || '';
        const zipCode = suggestion.context.find(c => c.id.includes('postcode'))?.text || '';

        setCity(city);
        setState(state);
        setZipCode(zipCode);
        setAddressSuggestions([]);
    };

    // Additional property address autofill handler
    const handleAdditionalAddressInputChange = async (e) => {
        const input = e.target.value;
        setAdditionalPropertyAddress(input);

        if (input.length > 2) {
            try {
                const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json`, {
                    params: {
                        access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
                        types: 'address',
                        autocomplete: true
                    }
                });
                setAdditionalAddressSuggestions(response.data.features);
            } catch (error) {
                console.error("Error fetching additional address suggestions:", error);
            }
        } else {
            setAdditionalAddressSuggestions([]);
        }
    };

    const handleAdditionalSuggestionClick = (suggestion) => {
        const fullAddress = suggestion.place_name || suggestion.text;
        const [streetAddress] = fullAddress.split(',');
        setAdditionalPropertyAddress(streetAddress);

        const city = suggestion.context.find(c => c.id.includes('place'))?.text || '';
        const state = suggestion.context.find(c => c.id.includes('region'))?.text || '';
        const zipCode = suggestion.context.find(c => c.id.includes('postcode'))?.text || '';

        setAdditionalCity(city);
        setAdditionalState(state);
        setAdditionalZipCode(zipCode);
        setAdditionalAddressSuggestions([]);
    };

    const handleAccountClick = () => {
        if (isLoggedIn) {
            // If logged in, navigate to the user account page
            navigate('/account');
        } else {
            // If not logged in, navigate to the sign-in page
            navigate('/signin');
        }
    };

    useEffect(() => {
        setIsLoggedIn(isTokenValid());
    }, []);

    const handleSubmit = async () => {
        try {
             // Log field values to verify they are set correctly
        console.log("Additional Property Fields:");
        console.log("Show Additional Property:", showAddProperty);
        console.log("Additional Property Name:", additionalPropertyName);
        console.log("Additional Property Address:", additionalPropertyAddress);
        console.log("Additional City:", additionalCity);
        console.log("Additional State:", additionalState);
        console.log("Additional Zip Code:", additionalZipCode);
            // Prepare the main payload
            const payload = {
                name,
                type: nameType === 'individual' ? 'name' : 'Company',
                propertyName,
                propertyAddress,
                city,
                state,
                zipCode,
                additionalProperties: []
            };
    
            // Check if the additional property fields are filled
            if (
                showAddProperty &&
                additionalPropertyName &&
                additionalPropertyAddress &&
                additionalCity &&
                additionalState &&
                additionalZipCode
            ) {
                payload.additionalProperties.push({
                    propertyName: additionalPropertyName,
                    propertyAddress: additionalPropertyAddress,
                    city: additionalCity,
                    state: additionalState,
                    zipCode: additionalZipCode
                });
            }
    
            console.log("Payload:", payload); // Debugging - check payload structure
    
            const response = await axios.post(
                'http://localhost:5000/add_landlord',
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            if (response.status === 201 || response.status === 200) {
                navigate('/');
            } else {
                console.error('Failed to add landlord:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error.response?.data?.message || error.message);
        }
    };
    

    return (
        <div className="add-a-landlord-main-container">
            <header>
                <img src={addALandlord} alt="OfficialLogo" className="add-a-landlord-center-logo" />
                <label className="add-a-landlord-center-logo-text">Add a Landlord</label>
                <img src={SubmitLandlordRate} alt="background" className="add-a-landlord-background-image" />
                <a href="/addalandlord"><img src={SubmitLandlordRate} alt="Submit Landlord Rate" className="add-a-landlord-left-icon" /></a>
                <img 
                    src={AccountButton} 
                    alt="Account Button" 
                    className="add-a-landlord-right"
                    onClick={handleAccountClick}
                    style={{cursor: 'pointer'}} />
            </header>

            {isLoggedIn ? <SideMenu /> : <NoAccountSideMenu />}

            {/*
            <div className="add-a-landlord-left-side-menu">
                <a href="/"><img src={OfficialLogo} alt="Logo" className="add-a-landlord-left-menu-logo" /></a>
                <ul>
                    <li><Link to="/"><img src={home} alt="Home" className="add-a-landlord-left-menu-icon" />Homepage</Link></li>
                    <li><Link to="/SearchResults"><img src={searchIcon} alt="Search" className="add-a-landlord-left-menu-icon" />Search</Link></li>
                    <li><Link to="/add-landlord"><img src={addLandlordIcon} alt="Add a Landlord" className="add-a-landlord-left-menu-icon" />Add a Landlord<img src={Triangle} alt="Triangle" className="add-a-landlord-triangle" /></Link></li>
                    <li><a href="/" onClick={handleSignOut}><img src={signOutIcon} alt="Sign Out" className="add-a-landlord-left-menu-icon" />Sign Out</a></li>
                    <li><Link to="/account"><img src={accountIcon} alt="My Account" className="add-a-landlord-left-menu-icon" />My Account</Link></li>
                    <li><Link to="/ratings"><img src={myrating} alt="My Ratings" className="add-a-landlord-left-menu-icon" />My Ratings</Link></li>
                    <li><Link to="/bookmarks"><img src={myBookmark} alt="My Bookmarks" className="add-a-landlord-left-menu-icon" />My Bookmarks</Link></li>
                </ul>
            </div>
            */}

            {/* Main Form */}
            <div className="add-a-landlord-input-box">
                <input
                    type="text"
                    className="add-a-landlord-name-box"
                    placeholder={nameType === 'individual' ? "First and Last Name" : "Company Name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
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

            {/* Property Name, Address, City, State, Zip Code */}
            <div className="add-a-landlord-input-box">
                <input
                    type="text"
                    className="add-a-landlord-property-name-box"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    required
                />
                <label className="add-a-landlord-property-name-text">Property Name:</label>
            </div>

            <div className="add-a-landlord-input-box">
                <input
                    type="text"
                    className="add-a-landlord-property-address-box"
                    placeholder="Street Address"
                    value={propertyAddress}
                    onChange={handleAddressInputChange}
                    required
                />
                <label className="add-a-landlord-property-address-text">Property Address:</label>

                {addressSuggestions.length > 0 && (
                    <ul className="address-suggestions">
                        {addressSuggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion.place_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="add-a-landlord-input-box">
                <input
                    type="text"
                    className="add-a-landlord-city-box"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <label className="add-a-landlord-city-text">City:</label>
            </div>

            <div className="add-a-landlord-input-box">
                <label className="add-a-landlord-state-text">State:</label>
                <select
                    className="add-a-landlord-state-dropdown"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a State</option>
                    {states.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                    ))}
                </select>
            </div>

            <div className="add-a-landlord-input-box">
                <input
                    type="text"
                    className="add-a-landlord-zip-code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                />
                <label className="add-a-landlord-zip-code-text">Zip Code:</label>
            </div>

            {/* Additional Property Section */}
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
                                value={additionalPropertyName}
                                onChange={(e) => setAdditionalPropertyName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Additional Property Address */}
                        <div className="add-a-landlord-additional-input-box" style={{ position: 'relative' }}>
                            <label className="add-a-landlord-additional-property-address-text">Property Address:</label>
                            <input
                                type="text"
                                className="add-a-landlord-additional-property-address-box"
                                placeholder="Street Address"
                                value={additionalPropertyAddress}
                                onChange={handleAdditionalAddressInputChange}
                                required
                            />
                            {additionalAddressSuggestions.length > 0 && (
                                <ul className="additional-address-suggestions">
                                    {additionalAddressSuggestions.map((suggestion, index) => (
                                        <li key={index} onClick={() => handleAdditionalSuggestionClick(suggestion)}>
                                            {suggestion.place_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Additional City */}
                        <div className="add-a-landlord-additional-input-box">
                            <label className="add-a-landlord-additional-city-text">City:</label>
                            <input
                                type="text"
                                className="add-a-landlord-additional-city-box"
                                placeholder="City"
                                value={additionalCity}
                                onChange={(e) => setAdditionalCity(e.target.value)}
                                required
                            />
                        </div>

                        {/* Additional State */}
                        <div className="add-a-landlord-additional-input-box">
                            <label className="add-a-landlord-additional-state-text">State:</label>
                            <select
                                className="add-a-landlord-additional-state-dropdown"
                                value={additionalState}
                                onChange={(e) => setAdditionalState(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a State</option>
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
                                value={additionalZipCode}
                                onChange={(e) => setAdditionalZipCode(e.target.value)}
                                required
                            />
                        </div>

			            {/* Additional text for submit */}
                        <div>
                        	<h3 className="add-a-landlord-additional-submit-text">Click Submit Landlord When Done</h3>
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button type="button" onClick={handleSubmit} className="add-a-landlord-submit-button">
                Submit Landlord
            </button>


        </div>
    );
}

export default AddALandlord;
