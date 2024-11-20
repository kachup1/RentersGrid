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
import axios from 'axios';


import './AddProperty.css';

function AddProperty() {

    const [isDisabled, setIsDisabled] = useState(false);
    const [propertyName,setPropertyName]=useState('');
    const [propertyAddress, setPropertyAddress]=useState('');
    const [city, setCity] = useState('Long Beach');
    const [state, setState] = useState('California');
    const [propertyZipcode, setZipcode] = useState('');
    const [suggestions,setSuggestions]=useState([]);
    const{landlordId} = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        // Log the API key temporarily
        console.log("Google API Key:", process.env.REACT_APP_GOOGLE_API_KEY);
        console.log("Current Address State:", propertyAddress);
    }, [propertyAddress]);

    useEffect(() => {
        console.log("Current Suggestions State:", suggestions); // Log the state
    }, [suggestions]);
    

    const handleSelectChange = (event) => {
        setIsDisabled(event.target.value === "No");
    };

    const handleSubmit = async ( )=> {
        if (isDisabled) return;
        const propertyData = {
            name:propertyName,
            address: propertyAddress,
            city,
            state,
            zipcode:propertyZipcode,
        };
        try{
            const response = await fetch(`http://localhost:5000/api/addproperty/${landlordId}`,
                {method:'POST',
                headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(propertyData)
            });
            if(response.status ===409){
                alert('A property with this address already exists.');
            }
            else if(response.ok){
                alert('Property added successfully');
                navigate(`/LandlordProfile/${landlordId}`); //redirects after the submission
            }else{
                alert('Failed to add property');
            }

        }catch(error)
        {
            console.error('Error adding property', error);
        }
    };


    const fetchSuggestions = async (query) => {
        console.log("Query sent to Google API:", query);
        if (query.length > 2) {
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
                    {
                        params: {
                            input: query,
                            key: process.env.frontend.REACT_APP_GOOGLE_API_KEY,
                            types: "address", // Restrict results to addresses
                           
                        },
                    }
                );
                console.log("API Response:", response.data); // Log the entire API response
                setSuggestions(response.data.predictions || []);
                console.log("Updated Suggestions State:", response.data.predictions || []);
            } catch (error) {
                console.error("Error fetching address suggestions:", error);
            }
        } else {
            setSuggestions([]); // Clear suggestions for short input
        }
    };
    

    const handleSuggestionClick = async (suggestion) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json`,
                {
                    params: {
                        place_id: suggestion.place_id,
                        key: process.env.REACT_APP_GOOGLE_API_KEY,
                    },
                }
            );
            const details = response.data.result;
    
            const addressComponents = details.address_components;
    
            const cityComponent = addressComponents.find((c) => c.types.includes("locality"));
            const stateComponent = addressComponents.find((c) =>
                c.types.includes("administrative_area_level_1")
            );
            const zipComponent = addressComponents.find((c) => c.types.includes("postal_code"));
    
            setPropertyAddress(details.formatted_address || "");
            setCity(cityComponent?.long_name || "");
            setState(stateComponent?.long_name || "");
            setZipcode(zipComponent?.long_name || "");
            setSuggestions([]); // Clear suggestions after selection
        } catch (error) {
            console.error("Error fetching place details:", error);
        }
    };
    


    return (
        <div className="add-property-container">

            {/* Sidebar menu */}
            <div className="sidebar">
                <img src={OfficialLogo} alt="Renters Grid Logo" className="sidebar-logo" onClick={() => navigate('/')} />
                <div className="menu-item">
                    <img src={HomePageIcon} alt="Homepage Icon" />
                    <span>Homepage</span>
                </div>
                <div className="menu-item">
                    <img src={SearchIcon} alt="Search Icon" />
                    <span>Search</span>
                </div>
                <div className="menu-item">
                    <img src={Landlord} alt="Add a Landlord Icon" />
                    <span>Add a Landlord</span>
                </div>
                <div className="menu-item">
                    <img src={SignOut} alt="Sign Out Icon" />
                    <span>Sign Out</span>
                </div>
                <div className="menu-item">
                    <img src={AccountButton} alt="Account Icon" />
                    <span>My Account</span>
                </div>
                <div className="menu-item">
                    <img src={Ratings} alt="Ratings Icon" />
                    <span>My Ratings</span>
                </div>
                <div className="menu-item">
                    <img src={Bookmark} alt="Bookmarks Icon" />
                    <span>My Bookmarks</span>
                </div>
            </div>
            {/*This is the Top right icons*/ }
            <div className="top-right-icons">
                <img src={AddLandlord} alt="Add Landlord Icon" />
                <img src={AccountButton} alt ="Account Icon"/>
            </div>
            {/*This is the title of the page*/ }
            <div className="title-section">
                <img src={Person} alt="Person Icon" className="person-icon" />
                <h1 className="title-text">Add a Property</h1>
            </div>
            {/*This is the form*/ }
            <div className="form-section">
                <label className="form-label">Add another property?</label>
                <select className="form-select" onChange={handleSelectChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label className="form-label required">Property  Name:</label>
                <input type="text" className="form-input" placeholder="Property Name" disabled={isDisabled} onChange={(e)=> setPropertyName(e.target.value)}/>

                <label className="form-label required">Property  Address:</label>
                <input type="text" className="form-input" placeholder="Street Address" value = {propertyAddress} onChange={(e)=>{
                    const value = e.target.value;
                    console.log("User Input: ",value);
                    setPropertyAddress(e.target.value);
                    fetchSuggestions(value);
                    }} disabled={isDisabled} />
                    <ul className="suggestions-list">
                        { console.log("Suggestions to render:", suggestions)} {/* Log suggestions */}
                        {suggestions.map((s,index)=>
                        (
                            <li key={index} onClick={()=> handleSuggestionClick(s)}>
                                {s.description}

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