// JavaScript source code
import React, {useEffect, useState,useRef}from 'react';
import {useNavigate}from 'react-router-dom';
import { useParams } from 'react-router-dom';

import TitleIcon from '../Assets/menu-3.svg';
import InsideAccountSideMenu from '../components/InsideAccountSideMenu';
import axios from 'axios';
import RightButtons from './RightButtons';
import BackgroundLogo from '../Assets/prop-bg.svg';

import styles from './AddProperty.module.css';

function AddProperty() {

    const [isDisabled, setIsDisabled] = useState(false);
    const [propertyName,setPropertyName]=useState('');
    const [propertyAddress, setPropertyAddress]=useState('');
    const [city, setCity] = useState('Long Beach');
    const [state, setState] = useState('');
    const [propertyZipcode, setZipcode] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [showSuggestions,setShowSuggestions] = useState(false);
    const [suggestions,setSuggestions]=useState([]);
    const suggestionRef = useRef(null);
    const{landlordId} = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false); // Hide suggestions if clicking outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Cleanup
        };
    }, []);

    const fetchSuggestions = async (query) => {
        if (query.length > 1) {
            try {
                console.log('Fetching suggestions for:', query); // Debugging
                const response = await axios.get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
                    {
                        params: {
                            access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN_MONTSE,
                            types: 'address',
                            autocomplete: true,
                            country: 'us',
                        },
                    }
                );
                console.log('API Response:', response.data); // Debugging
                setSuggestions(response.data.features || []);
            } catch (error) {
                console.error('Error fetching address suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };
    

    const handleSubmit = async () => {
        if(!propertyAddress||!city||!state||!propertyZipcode){
            alert("Please provide a complete address including city, state, and zipcode.");
            return;
        }


        const propertyData = {
            name: propertyName||propertyAddress, //If propertyName isn't filled then address will be used
            address: propertyAddress,
            city,
            state,
            zipcode: propertyZipcode,
            latitude,
            longitude,
        };

        try {
            const response = await fetch(`/api/addproperty/${landlordId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(propertyData),
            });

            if (response.status === 409) {
                alert('A property with this address already exists.');
            } else if (response.ok) {
                alert('Property added successfully');
                navigate(`/LandlordProfile/${landlordId}`);
            } else {
                alert('Failed to add property');
            }
        } catch (error) {
            console.error('Error adding property:', error);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const fullAddress = suggestion.place_name;
        const streetAddress = fullAddress.split(',')[0]; // Extract street address
        setPropertyAddress(streetAddress);
    
        const context = suggestion.context || [];
        const cityContext = context.find((c) => c.id.includes('place')); // Extract city
        const stateContext = context.find((c) => c.id.includes('region')); // Extract state
        const zipContext = context.find((c) => c.id.includes('postcode')); // Extract zipcode
    
        setCity(cityContext?.text || '');
        setState(stateContext?.text || ''); // Set the state dynamically
        setZipcode(zipContext?.text || '');
        setLatitude(suggestion.center[1]);
        setLongitude(suggestion.center[0]);
        setSuggestions([]);
    };
    
    const handleAddressChange = (e) => {
        const query = e.target.value;
        setPropertyAddress(query);
        
        if (query.length > 1) {
            setShowSuggestions(true); // Show suggestions when query is valid
            fetchSuggestions(query);
        } else {
            setShowSuggestions(false); // Hide suggestions for short queries
        }
    };
    
    return (
        <div className={styles["add-property-container"]}>

            {/* Sidebar menu */}
            <InsideAccountSideMenu/>

            {/* main content*/}
            <main className={styles["main-content"]}>
                {/* Background logo */}
                <img src={BackgroundLogo} alt="Background Logo" className={styles["background-logo"]} />

                 {/*Title*/ }
                <div className={styles["title-container"]}>
                <img src={TitleIcon} alt="Account" className={styles.titleicon} />
                    <h2>Add A Property</h2>
                </div>
    
   
                {/* Property Form */}
                <div className={styles["form-section"]}>


                    {/* Property Name Input */}
                    <label className={styles["form-label"]}>Property Name:</label>
                    <input
                        type="text"
                        className={styles["form-input"]}
                        value={propertyName}
                        disabled={isDisabled}
                        onChange={(e) => setPropertyName(e.target.value)}
                    />

                    {/* Property Address Input with Suggestions */}
                    <label className={styles["form-label"]}>Property Address:</label>
                    <input
                        type="text"
                        className={styles["form-input"]}
                        value={propertyAddress}
                        onChange={handleAddressChange}
                        placeholder="Enter an Address"
                    />
                    <ul
                className={`${styles["suggestions-list"]} ${
                    showSuggestions ? styles["visible"] : ""
                }`}
                ref={suggestionRef}
            >
                {suggestions.map((s, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(s)}>
                        {s.place_name}
                    </li>
                ))}
            </ul>

                    <div className={styles["address-row"]}>
  {/* City Input */}
  <div className={styles["address-group"]}>
    <label className={styles["form-label-city"]}>City:</label>
    <input
      type="text"
      className={styles["form-input-city"]}
      value={city}
      onChange={(e) => setCity(e.target.value)}
    />
  </div>

  {/* State Input */}
  <div className={styles["address-group"]}>
    <label className={styles["form-label"]}>State:</label>
    <input
    type="text"
      className={styles["form-input-state"]}
      value={state}
      onChange={(e) => setState(e.target.value)}
      placeholder="State"
    
    />
  </div>

  {/* Zip Code Input */}
  <div className={styles["address-group"]}>
    <label className={styles["form-label"]}>Zip Code:</label>
    <input
      type="text"
      className={styles["form-input-zipcode"]}
      value={propertyZipcode}
      onChange={(e) => setZipcode(e.target.value)}
    />
  </div>
</div>

                    {/* Submit Button */}
                    <button
                        className={styles["submit-button"]}
                        onClick={handleSubmit}
                        disabled={isDisabled}
                    >
                        Submit Property
                    </button>
            </div>



            </main>
            {/* Top-Right Icons */}
            <div className={styles["right-buttons"]}>
                    <RightButtons />
            </div>
        </div>
    );

}
export default AddProperty;