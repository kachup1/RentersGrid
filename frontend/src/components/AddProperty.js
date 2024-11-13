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


import './AddProperty.css';

function AddProperty() {

    const [isDisabled, setIsDisabled] = useState(false);
    const [propertyName,setPropertyName]=useState('');
    const [propertyAddress, setPropertyAddress]=useState('');
    const [city, setCity] = useState('Long Beach');
    const [state, setState] = useState('California');
    const [propertyZipcode, setZipcode] = useState('');
    const{landlordId} = useParams()
    const navigate = useNavigate();

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
            zipcode:propertyZipcode
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

                <label className="form-label required">Property 2 Name:</label>
                <input type="text" className="form-input" placeholder="Property Name" disabled={isDisabled} onChange={(e)=> setPropertyName(e.target.value)}/>

                <label className="form-label required">Property 2 Address:</label>
                <input type="text" className="form-input" placeholder="Street Address" disabled={isDisabled} onChange={(e)=> setPropertyAddress(e.target.value)} />

                <label className="form-label">City:</label>
                <input type="text" className="form-input" placeholder="City" defaultValue="Long Beach" disabled={isDisabled} />

                <label className="form-label">State:</label>
                <select className="form-select" disabled={isDisabled}>
                    <option>California</option>
                    {/* Add other states as options if needed */}
                </select>

                <label className="form-label">Zipcode:</label>
                <input type="text" className="form-input" placeholder="Zipcode" disabled={isDisabled} onChange={(e)=> setZipcode(e.target.value)}/>

                <button className="submit-button" onClick={handleSubmit} disabled ={isDisabled}> Submit Property</button>
            </div>


        </div>
    );

}
export default AddProperty;