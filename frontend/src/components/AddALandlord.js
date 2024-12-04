import React, { useState, useEffect, useRef } from 'react';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import addALandlord from '../Assets/add-a-landlord-title.svg';
import axios from 'axios';
import { getUserIdFromToken, isTokenValid } from './authentication';
import styles from './AddALandlord.module.css';
import RightButtons from './RightButtons';
import InsideAccountSideMenu from './InsideAccountSideMenu';
import Header from './header2';

function AddALandlord() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen( prevState => !prevState);

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
    }, []);

    const additionalPropertyRef = useRef(null);

    //track if a click originated from the button to avoid immediate closing:
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click happened outside the additional property form
            if (additionalPropertyRef.current && !additionalPropertyRef.current.contains(event.target)
            &&buttonRef.current&&!buttonRef.current.contains(event.target)) {
                setShowAddProperty(false); // Close the form if clicked outside
            }
        };
    
        // Add the event listener to detect clicks outside the additional property form
        document.addEventListener('mousedown', handleClickOutside);
    
        // Clean up the event listener when the component unmounts or updates
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
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
                        country: 'us'
                    }
                });

                
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
                        autocomplete: true,
                        country: 'us'
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

    useEffect(() => {
        setIsLoggedIn(isTokenValid());
    }, []);

    const handleSubmit = async () => {
        try {
             
            // Prepare the main payload
            const payload = {
                name,
                type: nameType === 'individual' ? 'name' : nameType === 'company' ? 'Company' : nameType === 'both' ? 'Both':'',
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
        <div className={styles.addALandlordMainContainer}>
            
            <header>
                <img src={addALandlord} alt="OfficialLogo" className={styles['add-a-landlord-center-logo']} />
                <label className={styles['add-a-landlord-center-logo-text']}>Add a Landlord</label>
                <img src={SubmitLandlordRate} alt="background" className={styles['add-a-landlord-background-image']} />
            </header>

            {/* Main Form */}
            <div className={styles["add-a-landlord-input-box"]}>
                <input
                    type="text"
                    className={styles["add-a-landlord-name-box"]}
                    placeholder={nameType === 'individual' ? "First and Last Name" 
                        : nameType ===  'company' ? "Company Name" 
                        : nameType === 'both' ? "First and Last Name / Company Name":""}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className={styles["add-a-landlord-name-toggle-button"]}>
                <button
                    type="button"
                    className={nameType === 'individual' ? styles['add-a-landlord-toggle-button-active'] : styles['add-a-landlord-toggle-button']}
                    onClick={() => setNameType('individual')}
                >
                    Name
                </button>
                <button
                    className={nameType === 'company' ? styles['add-a-landlord-toggle-button-active'] : styles['add-a-landlord-toggle-button']}
                    onClick={() => setNameType('company')}
                >
                    Company Name
                </button>
                <button 
                        className={nameType === 'both' ? styles['add-a-landlord-toggle-button-active']: styles['add-a-landlord-toggle-button']}
                        onClick={() => setNameType('both')} // Set nameType to 'both' when selected
                        
                    >
                        Both
                    </button>
            </div>

            {/* Property Name, Address, City, State, Zip Code */}
            <div className={styles["add-a-landlord-input-box"]}>
                <input
                    type="text"
                    className={styles["add-a-landlord-property-name-box"]}
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    required
                />
                <label className={styles["add-a-landlord-property-name-text"]}>Property Name:</label>
            </div>

            <div className={styles["add-a-landlord-input-box"]}>
                <input
                    type="text"
                    className={styles["add-a-landlord-property-address-box"]}
                    placeholder="Street Address"
                    value={propertyAddress}
                    onChange={handleAddressInputChange}
                    required
                />
                <label className={styles["add-a-landlord-property-address-text"]}>Property Address:</label>

                {addressSuggestions.length > 0 && (
                    <ul className={styles["address-suggestions"]}>
                        {addressSuggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion.place_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles["add-a-landlord-input-box"]}>
                <input
                    type="text"
                    className={styles["add-a-landlord-city-box"]}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
                <label className={styles["add-a-landlord-city-text"]}>City:</label>
            </div>

            <div className={styles["add-a-landlord-input-box"]}>
                <label className={styles["add-a-landlord-state-text"]}>State:</label>
                <select
                    className={styles["add-a-landlord-state-dropdown"]}
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

            <div className={styles["add-a-landlord-input-box"]}>
                <input
                    type="text"
                    className={styles["add-a-landlord-zip-code"]}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                />
                <label className={styles["add-a-landlord-zip-code-text"]}>Zip Code:</label>
            </div>

            {/* Additional Property Section */}
            <div className={styles["add-a-landlord-additional-property-container"]}>
                <button
                    ref={buttonRef}
                    className={styles["add-a-landlord-additional-property-button"]}
                    onClick={() => setShowAddProperty(prev => !prev)}
                >
                    {showAddProperty ? 'Hide Additional Property' : 'Add another property?'}
                </button>

                {showAddProperty && (
                    <div ref={additionalPropertyRef} className={styles["additional-property-form"]}>
                        {/* Additional Property Name */}
                        <div className={styles["add-a-landlord-additional-input-box"]}>
                            <label className={styles["add-a-landlord-additional-property-name-text"]}>Property Name:</label>
                            <input
                                type="text"
                                className={styles["add-a-landlord-additional-property-name-box"]}
                                placeholder="Property Name"
                                value={additionalPropertyName}
                                onChange={(e) => setAdditionalPropertyName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Additional Property Address */}
                        <div className={styles["add-a-landlord-additional-input-box"]} style={{ position: 'relative' }}>
                            <label className={styles["add-a-landlord-additional-property-address-text"]}>Property Address:</label>
                            <input
                                type="text"
                                className={styles["add-a-landlord-additional-property-address-box"]}
                                placeholder="Street Address"
                                value={additionalPropertyAddress}
                                onChange={handleAdditionalAddressInputChange}
                                required
                            />
                            {additionalAddressSuggestions.length > 0 && (
                                <ul className={styles["additional-address-suggestions"]}>
                                    {additionalAddressSuggestions.map((suggestion, index) => (
                                        <li key={index} onClick={() => handleAdditionalSuggestionClick(suggestion)}>
                                            {suggestion.place_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Additional City */}
                        <div className={styles["add-a-landlord-additional-input-box"]}>
                            <label className={styles["add-a-landlord-additional-city-text"]}>City:</label>
                            <input
                                type="text"
                                className={styles["add-a-landlord-additional-city-box"]}
                                placeholder="City"
                                value={additionalCity}
                                onChange={(e) => setAdditionalCity(e.target.value)}
                                required
                            />
                        </div>

                        {/* Additional State */}
                        <div className={styles["add-a-landlord-additional-input-box"]}>
                            <label className={styles["add-a-landlord-additional-state-text"]}>State:</label>
                            <select
                                className={styles["add-a-landlord-additional-state-dropdown"]}
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
                        <div className={styles["add-a-landlord-additional-input-box"]}>
                            <label className={styles["add-a-landlord-additional-zip-code-text"]}>Zip Code:</label>
                            <input
                                type="text"
                                className={styles["add-a-landlord-additional-zip-code-box"]}
                                placeholder="Zip Code"
                                value={additionalZipCode}
                                onChange={(e) => setAdditionalZipCode(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button type="button" onClick={handleSubmit} className={styles["add-a-landlord-submit-button"]}>
                Submit Landlord
            </button>
            <div className={styles['left-side-menu']}>
                <InsideAccountSideMenu />
            </div>
            {/* Top-Right Icons*/}
            <div className={styles["right-buttons"]}>
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>

        </div>
    );
}

export default AddALandlord;
