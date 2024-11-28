// JavaScript source code
import React, {useEffect, useState}from 'react';
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
    const [state, setState] = useState('California');
    const [propertyZipcode, setZipcode] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [suggestions,setSuggestions]=useState([]);
    const{landlordId} = useParams()
    const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState(null); // Track selected option

    const handleSelectChange = (event) => {
        const { value } = event.target || event; // Adjusted to handle both button and dropdown events
        setSelectedOption(value);
        console.log(`Selected Option: ${value}`); // Debugging to confirm selection
    };

    
    const fetchSuggestions = async (query) => {
        if (query.length > 1) {
            try {
                const response = await axios.get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
                    {
                        params: {
                            access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN_MONTSE,
                            types: 'address',
                            autocomplete: true,
                            country:'us'
                        },
                    }
                );
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
            const response = await fetch(`http://localhost:5000/api/addproperty/${landlordId}`, {
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
        const streetAddress = fullAddress.split(',')[0]; // Extract only the street address
        setPropertyAddress(streetAddress);
    
        const context = suggestion.context || [];
        const cityContext = context.find((c) => c.id.includes('place'));
        const stateContext = context.find((c) => c.id.includes('region'));
        const zipContext = context.find((c) => c.id.includes('postcode'));
    
        setCity(cityContext?.text || '');
        setState(stateContext?.text || '');
        setZipcode(zipContext?.text || '');
        setLatitude(suggestion.center[1]);
        setLongitude(suggestion.center[0]);
        setSuggestions([]);
    };
    
    const handleAddressChange = (e) => {
        const query = e.target.value;
        setPropertyAddress(query);
        fetchSuggestions(query);
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
    
                {/*This is the form*/}
                <div className={styles["form-section"]}>
                <label className={styles["form-label"]}>Add another property?</label>
                <div className={styles["button-group"]}>
                    <div className={styles["button-container"]}>
                        <button
                            className={`${styles["form-button"]} ${selectedOption === 'Yes' ? styles["active"] : ''}`}
                            onClick={() => handleSelectChange({ value: 'Yes' })}
                        >
                            Yes
                        </button>
                    </div>
                    <div className={styles["button-container"]}>
                        <button
                            className={`${styles["form-button"]} ${selectedOption === 'No' ? styles["active"] : ''}`}
                            onClick={() => handleSelectChange({ value: 'No' })}
                        >
                            No
                        </button>
                    </div>
                </div>
        

                    <label className={styles["form-label"]}>Property  Name:</label>
                    <input
                        type="text"
                        className={styles["form-input"]}
                        value={propertyName}
                        disabled={isDisabled}
                        onChange={(e) => setPropertyName(e.target.value)}
                    />

                    <label className={styles["form-label"]}>Property  Address:</label>
                    <input
                        type="text"
                        className={styles["form-input"]}
                        value={propertyAddress}
                        onChange={handleAddressChange}
                        placeholder="Enter an Address"
                    />
                    <ul className={styles["suggestions-list"]}>
                        {console.log("Suggestions to map:", suggestions)} {/* Log suggestions */}
                        {suggestions.map((s, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(s)}>
                                {s.place_name}
                            </li>
                        ))}
                    </ul>

                    <label className={styles["form-label-city"]}>City:</label>
                    <input
                        type="text"
                        className={styles["form-input-city"]}
                        value={city}
                        disabled={isDisabled}
                    />

                    <label className={styles["form-label"]}>State:</label>
                    <select className={styles["form-select"]} disabled={isDisabled}>
                        <option>{state}</option>
                    </select>

                    <label className={styles["form-label"]}>Zipcode:</label>
                    <input
                        type="text"
                        className={styles["form-input-zipcode"]}
                        value={propertyZipcode}
                        disabled={isDisabled}
                        onChange={(e) => setZipcode(e.target.value)}
                    />

                    <button className={styles["submit-button"]} onClick={handleSubmit} disabled={isDisabled}>
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