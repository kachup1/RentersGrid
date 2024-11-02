import React, { useState } from 'react';
import './AddAReview.css'; // import the CSS file
import OfficialLogo from '../Assets/official logo.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import SideMenu from './SideMenu';
import AccountButton from '../Assets/Account button.svg';
import AddRatingTitle from '../Assets/add-rating-title.svg';
import DownArrow from '../Assets/downward.svg'; // Use the downward arrow SVG
import Face1 from '../Assets/face-1.svg';
import Face2 from '../Assets/face-2.svg';
import Face3 from '../Assets/face-3.svg';
import Face4 from '../Assets/face-4.svg';
import Face5 from '../Assets/face-5.svg';
import NextButton from '../Assets/next-green.svg';
import BackButton from '../Assets/back-green.svg';
import Maintenance from '../Assets/mente.svg';
import Pets from '../Assets/pets.svg';
import Safe from '../Assets/safe.svg';
import Money from '../Assets/money.svg';
import UpGreen from '../Assets/up-green.svg';
import DownRed from '../Assets/down-red.svg';



const AddAReview = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRating, setSelectedRating] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState("Fairview Apartment");

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOptionSelect = (value) => {
        setSelectedProperty(value);
        setDropdownOpen(false);
    };

    const propertyOptions = [
        "Fairview Apartment",
        "Greenwood Residence",
        "Maple Street Complex"
    ];

    const handleSubmit = () => {
        console.log('Submitting review...');
    };

    const handleRatingSelect = (rating) => {
        setSelectedRating(rating);
    };

    return (
        <div className="main-container-add-a-rating">
            <SideMenu />

            {/* Header section */}
            <header className="headerhp">
                <div className="logohp-container">
                    <img
                        src={OfficialLogo}
                        alt="Official Logo"
                        className="center-logo"
                    />
                </div>

                <div className="buttons-container">
                    <img
                        src={SubmitLandlordRate}
                        alt="Submit Landlord Rate"
                        className="left-icon"
                    />
                    <a href="/account">
                        <img
                            src={AccountButton}
                            alt="Account Button"
                            className="account-right"
                        />
                    </a>
                </div>
            </header>

            {currentStep === 1 && (
                <div className="form-container-add-a-rating">
                    <div className="add-rating-image">
                        <h1>
                            <img
                                src={AddRatingTitle}
                                alt="Add Rating Title"
                                className="add-rating-title"
                            />
                        </h1>
                    </div>
                    <div className="you-are-rating">
                        <h2>You are Rating:</h2>
                    </div>

                    <div className="you-are-rating-landlord-name">
                        <h3>Francisco Diaz</h3>
                    </div>

                    <div className="write-a-review-string">
                        <h3>Write a Review:</h3>
                    </div>
                    <div className="review-box">
                        <textarea placeholder="What do you want other tenants to know about this landlord?" />
                    </div>

                    <div className="guidelines">
                        <div className="guidelines-string">
                            <h3>Guidelines</h3>
                        </div>
                        <div className="guidelines-rules">
                            <ul>
                                <li>- No use of profanity or derogatory terms</li>
                                <li>- Be honest and specific</li>
                                <li>- Stay professional and respectful</li>
                                <li>- Protect your privacy</li>
                            </ul>
                        </div>
                    </div>

                    {/* Select Property Section */}
                    <div className="select-property">
                        <div className="label-container">
                            <label>* Select Property:</label>
                        </div>
                            <div className="dropdown-container">
                                <div className="dropdown-selected" onClick={handleDropdownToggle}>
                                    <span>{selectedProperty}</span>
                                    <img
                                        src={DownArrow}
                                        alt="Down Arrow"
                                        className={`down-arrow ${dropdownOpen ? 'open' : ''}`} // Rotate arrow when open
                                        style={{
                                            transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    />
                                </div>

                                {dropdownOpen && (
                                    <ul className="dropdown-options">
                                        {propertyOptions.map((option) => (
                                            <li
                                                key={option}
                                                onClick={() => handleOptionSelect(option)}
                                                className={`dropdown-item ${selectedProperty === option ? 'selected' : ''}`}
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        
                    </div>

                    <div className="rate-your-landlord-string">
                        <h4>* Rate Your Landlord:</h4>
                    </div>

                    <div className="rating-icons">
                        {[Face1, Face2, Face3, Face4, Face5].map((face, index) => (
                            <img
                                key={index}
                                src={face}
                                alt={`Rating ${index + 1}`}
                                className={`rating-icon ${
                                    selectedRating >= index + 1 || selectedRating === 0 ? 'active' : 'inactive'
                                }`}
                                onClick={() => handleRatingSelect(index + 1)}
                            />
                        ))}
                    </div>

                </div>
            )}

            {/* Button row to navigate between steps and submit the form */}
            {currentStep < 4 ? (
                <button 
                    className="next-btn"
                    onClick={() => setCurrentStep(currentStep + 1)}
                />
            ) : (
                <button 
                    className="next-btn"
                    onClick={handleSubmit}
                />
            )}
        </div>
    );
};

export default AddAReview;
