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
import Reachable from '../Assets/reachable.svg';
import Contract from '../Assets/contract.svg';
import Recommend from '../Assets/reco.svg';
import ThumbsUp from '../Assets/up-green.svg';
import ThumbsDown from '../Assets/down-red.svg';
import SubmitReview from '../Assets/submit-review_1.svg';




const AddAReview = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRating, setSelectedRating] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState("Fairview Apartment");
    const [reviewText, setReviewText] = useState(""); // For the review text
    const [isChecked, setIsChecked] = useState(false); // For the checkbox in Frame 4

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
        if (isChecked) {
            console.log('Review submitted');
            // Add your submit logic here
        } else {
            alert("Please confirm your review is truthful.");
        }
    };

    // Handle rating selection for each criterion with toggle functionality
    const handleRatingSelect = (key, value) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [key]: prevRatings[key] === value ? null : value
        }));
    };

    const handleSmileyClick = (rating) => {
        setSelectedRating(rating);
    };
    

    const [ratings, setRatings] = useState({
        maintenance: null,
        pets: null,
        safe: null,
        rent: null,
        reachable: null,
        contract: null,
        recommend: null
    });

    const Criterion = ({ name, icon, ratingKey, ratings, handleRatingSelect }) => (
        <div className="criteria">
            <img src={icon} alt={name} className="criterion-icon" />
            <p className="criterion-text">{name}</p>
            <div className="thumbs">
                <img src={ThumbsUp} alt="Thumbs Up" className={`thumb ${ratings[ratingKey] === 'up' ? 'selected' : ''}`} onClick={() => handleRatingSelect(ratingKey, 'up')} />
                <img src={ThumbsDown} alt="Thumbs Down" className={`thumb ${ratings[ratingKey] === 'down' ? 'selected' : ''}`} onClick={() => handleRatingSelect(ratingKey, 'down')} />
            </div>
        </div>
    );

    const CriterionReview = ({ name, rating, icon }) => (
        <div className="criteria">
            <img src={icon} alt={name} className="criterion-icon" />
            <p className="criterion-text">{name}</p>
            <div className="thumbs">
                {rating === 'up' ? (
                    <img src={ThumbsUp} alt="Thumbs Up" className="thumb selected" />
                ) : rating === 'down' ? (
                    <img src={ThumbsDown} alt="Thumbs Down" className="thumb selected" />
                ) : (
                    <p>Not rated</p>
                )}
            </div>
        </div>
    );

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
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
{/**Frame 1 ----------------------------------------------- */}
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
                                className={`rating-icon ${selectedRating === 0 || index + 1 <= selectedRating ? 'colored' : 'inactive'}`}
                                onClick={() => handleSmileyClick(index + 1)}
                            />
                        ))}
                    </div>
                </div>
            )}

{/* Frame 2 Content ----------------------------------------------*/}
{currentStep === 2 && (
    <div className="rating-criteria-container">
        {/* Maintenance Criterion */}
        <div className="criteria">
            <img src={Maintenance} alt="Maintenance" className="criterion-icon"/>
            <p className="criterion-text">Timely Maintenance</p>
            <div className="thumbs">
                <img
                    src={ThumbsUp}
                    alt="Thumbs Up"
                    className={`thumb ${ratings.maintenance === 'up' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('maintenance', 'up')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`thumb ${ratings.maintenance === 'down' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('maintenance', 'down')}
                />
            </div>
        </div>
        
        {/* Pets Criterion */}
        <div className="criteria">
            <img src={Pets} alt="Allows Pets" className="criterion-icon"/>
            <p className="criterion-text">Allow Pets</p>
            <div className="thumbs">
                <img
                    src={ThumbsUp}
                    alt="Thumbs Up"
                    className={`thumb ${ratings.pets === 'up' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('pets', 'up')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`thumb ${ratings.pets === 'down' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('pets', 'down')}
                />
            </div>
        </div>
        
        {/* Safe Area Criterion */}
        <div className="criteria">
            <img src={Safe} alt="Safe Area" className="criterion-icon"/>
            <p className="criterion-text">Safe Area</p>
            <div className="thumbs">
                <img
                    src={ThumbsUp}
                    alt="Thumbs Up"
                    className={`thumb ${ratings.safe === 'up' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('safe', 'up')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`thumb ${ratings.safe === 'down' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('safe', 'down')}
                />
            </div>
        </div>
        
        {/* Raise Rent Criterion */}
        <div className="criteria">
            <img src={Money} alt="Raise Rent Yearly" className="criterion-icon"/>
            <p className="criterion-text">Raise Rent Yearly</p>
            <div className="thumbs">
                <img
                    src={ThumbsUp}
                    alt="Thumbs Up"
                    className={`thumb ${ratings.rent === 'up' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('rent', 'up')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`thumb ${ratings.rent === 'down' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('rent', 'down')}
                />
            </div>
        </div>
    </div>
)}
{/* Frame 3 Content ---------------------------------------------- */}
            {currentStep === 3 && (
                <div className="rating-criteria-container">
                    {/* Reachable & Responsive Criterion */}
                    <div className="criteria">
                        <img src={Reachable} alt="Reachable & Responsive" className="criterion-icon"/>
                        <p className="criterion-text">Reachable & Responsive</p>
                        <div className="thumbs">
                            <img
                                src={ThumbsUp}
                                alt="Thumbs Up"
                                className={`thumb ${ratings.reachable === 'up' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('reachable', 'up')}
                            />
                            <img
                                src={ThumbsDown}
                                alt="Thumbs Down"
                                className={`thumb ${ratings.reachable === 'down' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('reachable', 'down')}
                            />
                        </div>
                    </div>

                    {/* Clear & Fair Contract Criterion */}
                    <div className="criteria">
                        <img src={Contract} alt="Clear & Fair Contract" className="criterion-icon"/>
                        <p className="criterion-text">Clear & Fair Contract</p>
                        <div className="thumbs">
                            <img
                                src={ThumbsUp}
                                alt="Thumbs Up"
                                className={`thumb ${ratings.contract === 'up' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('contract', 'up')}
                            />
                            <img
                                src={ThumbsDown}
                                alt="Thumbs Down"
                                className={`thumb ${ratings.contract === 'down' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('contract', 'down')}
                            />
                        </div>
                    </div>

                    {/* Would you recommend to others? Criterion */}
                    <div className="criteria">
                        <img src={Recommend} alt="Would you recommend to others?" className="criterion-icon"/>
                        <p className="criterion-text">Would you recommend?</p>
                        <div className="thumbs">
                            <img
                                src={ThumbsUp}
                                alt="Thumbs Up"
                                className={`thumb ${ratings.recommend === 'up' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('recommend', 'up')}
                            />
                            <img
                                src={ThumbsDown}
                                alt="Thumbs Down"
                                className={`thumb ${ratings.recommend === 'down' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('recommend', 'down')}
                            />
                           
                        </div>
                    </div>
                </div>
            )}
{/* Frame 4 Content -------------------------------------------- */}
{currentStep === 4 && (
    <div className="frame4-container">
        {/* Header and Landlord Info */}
        <div className="frame-4-add-rating-image">
            <h1>
                <img
                    src={AddRatingTitle}
                    alt="Add Rating Title"
                    className="add-rating-title"
                />
            </h1>
        </div>
        
        <div className="frame-4-you-are-rating">
            <h2>You Are Rating:</h2>
        </div>

        <div className="frame-4-you-are-rating-landlord-name">
            <h3>Francisco Diaz</h3>
        </div>

        {/* Review Text Display */}
        <div className="frame-4-write-a-review-string">
            <h3>Review:</h3>
        </div>
        <div className="frame4-review-text">
            <p>{reviewText || "No review provided"}</p>
        </div>

        {/* Property Display */}
        <div className="select-property frame4-position">
            <div className="label-container">
                <label>Property:</label>
            </div>
            <div className="dropdown-container">
                <span className="dropdown-selected">{selectedProperty}</span>
            </div>
        </div>

        {/* Overall Rating Icons */}
        <div className="frame-4-rate-your-landlord-string">
            <h4>Your Rating:</h4>
        </div>
        <div className="frame4-rating-icons">
            {[Face1, Face2, Face3, Face4, Face5].map((face, index) => (
                <img
                    key={index}
                    src={face}
                    alt={`Rating ${index + 1}`}
                    className={`rating-icon ${selectedRating >= index + 1 ? 'active' : 'inactive'}`}
                />
            ))}
        </div>

        {/* Criterion Ratings */}
        <div className="frame4-criterion-container-4">
            <CriterionReview name="Timely Maintenance" rating={ratings.maintenance} icon={Maintenance} />
            <CriterionReview name="Allows Pets" rating={ratings.pets} icon={Pets} />
            <CriterionReview name="Safe Area" rating={ratings.safe} icon={Safe} />
            <CriterionReview name="Raises Rent Yearly" rating={ratings.rent} icon={Money} />
        </div>
        <div className="frame4-criterion-container-3">
            <CriterionReview name="Reachable & Responsive" rating={ratings.reachable} icon={Reachable} />
            <CriterionReview name="Clear & Fair Contract" rating={ratings.contract} icon={Contract} />
            <CriterionReview name="Would you recommend?" rating={ratings.recommend} icon={Recommend} />
        </div>

        {/* Checkbox Section */}
        <div className="checkbox-container">
                        <label>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                            I confirm that my review is truthful and based on my personal experience.
                        </label>
                    </div>

                    {/* Buttons for Frame 4 */}
                    <div className="frame4-buttons-container">
                        <div className="frame4-back-container">
                            <button
                                className="frame4-back-btn"
                                onClick={() => setCurrentStep(currentStep - 1)}
                            >
                                <img src={BackButton} alt="Back" />
                            </button>
                        </div>

                        <div className="frame4-submit-container">
                            <button
                                className="frame4-submit-btn"
                                onClick={handleSubmit}
                                disabled={!isChecked} // Disable unless checked
                            >
                                <img src={SubmitReview} alt="Submit Review" />
                            </button>
                        </div>
                    </div>

    </div>
)}

{/* Button for frame 1 (Next Button) */}
{currentStep === 1 && (
    <button
        className="next-btn-frame1"
        onClick={() => setCurrentStep(currentStep + 1)}
    ></button>
)}

{/* Button Row for frames 2 and 3 */}
{currentStep > 1 && currentStep < 4 && (
    <div className="button-row">
        <button
            className="back-btn"
            onClick={() => setCurrentStep(currentStep - 1)}
        ></button>
        <button
            className="next-btn"
            onClick={() => setCurrentStep(currentStep + 1)}
        ></button>
    </div>
)}
  
    </div>
    );
};

export default AddAReview;
