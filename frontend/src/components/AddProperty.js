// JavaScript source code
import React, {useEffect, useState}from 'react';
import {useNavigate}from 'react-router-dom';
import { useParams } from 'react-router-dom';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import AddLandlord from '../Assets/submit landlord rate.svg';
import HomePageIcon from '../Assets/home.svg';
import SearchIcon from '../Assets/menu-1.svg';
import Person from '../Assets/landlord person.svg';
import Landlord from '../Assets/menu-2.svg';
import SignOut from '../Assets/menu-4.svg';
import Bookmark from '../Assets/my bookmark.svg';
import Ratings from '../Assets/my-rating.svg';
import InsideAccountSideMenu from '../components/InsideAccountSideMenu';
import axios from 'axios';


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

    
    

    const handleSelectChange = (event) => {
        setIsDisabled(event.target.value === "No");
    };

    const handleSubmit = async () => {
        const propertyData = {
            name: propertyName,
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
        <div className="add-property-container">

            {/* Sidebar menu */}
            <div className= {styles["add-property-side-menu"]}>
                <InsideAccountSideMenu/>
            </div>
            {/*This is the Top right icons*/ }
            <div className={styles["top-right-icons"]}>
                <img src={AddLandlord} alt="Add Landlord Icon" onClick={()=>navigate('/AddALandlord')} />
                <img src={AccountButton} alt ="Account Icon"onClick={()=>navigate('/myaccount')}/>
            </div>
            {/*This is the title of the page*/ }
            <div className={styles["title-section"]}>
                <img src={Person} alt="Person Icon" className={styles["person-icon"]} />
                <h1 className={["title-text"]}>Add a Property</h1>
            </div>
            {/*This is the form*/ }
            <div className="form-section">
                <label className="form-label">Add another property?</label>
                <select className="form-select" onChange={handleSelectChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label className="form-label required">Property  Name:</label>
                <input type="text" className="form-input" value={propertyName} disabled={isDisabled} onChange={(e)=> setPropertyName(e.target.value)}/>

                <label className="form-label required">Property  Address:</label>
                <input type="text" className="form-input" value = {propertyAddress} onChange={handleAddressChange} placeholder='Enter an Address'

                   />
                    <ul className="suggestions-list">
    {console.log("Suggestions to map:", suggestions)} {/* Log suggestions */}
    {suggestions.map((s, index) => (
        <li key={index} onClick={() => handleSuggestionClick(s)}>
            {s.place_name}
        </li>
    ))}
</ul>


                <label className="form-label">City:</label>
                <input type="text" className="form-input" value={city} /*placeholder="City"defaultValue="Long Beach"*/ disabled={isDisabled} />

                <label className="form-label">State:</label>
                <select className="form-select" disabled={isDisabled}>
                    <option>{state}</option>
                    {/* Add other states as options if needed */}
                </select>

                <label className="form-label">Zipcode:</label>
                <input type="text" className="form-input" /*placeholder="Zipcode"*/ value={propertyZipcode} disabled={isDisabled} onChange={(e)=> setZipcode(e.target.value)}/>

                <button className="submit-button" onClick={handleSubmit} disabled ={isDisabled}> Submit Property</button>
            </div>


        </div>
    );

}
export default AddProperty;