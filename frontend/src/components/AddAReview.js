import React, { useEffect, useState } from 'react';
import './AddAReview.css'; // import the CSS file
import OfficialLogo from '../Assets/official logo.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import SideMenu from './SideMenu';
import NoAccountSideMenu from './NoAccountSideMenu';
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
import axios from 'axios';
import { getUserIdFromToken, isTokenValid } from './authentication';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';//this is needed to get landlordID:

const AddAReview = () => {
    //state hooks
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRating, setSelectedRating] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState("");
    const [reviewText, setReviewText] = useState(""); // For the review text
    const [isChecked, setIsChecked] = useState(false); // For the checkbox in Frame 4
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [landlordName, setLandlordName] = useState(""); // For the landlord's name
    const [propertyOptions, setPropertyOptions] = useState([]); // For the landlord's properties
    const [propertyError, setPropertyError] = useState(false);
    const [ratingError, setRatingError] = useState(false);
    const [checkboxError, setCheckboxError] = useState(false);//tracks checkbox error message
    const navigate = useNavigate();
    const{landlordId} = useParams();//this gets the landlordId from the URL
    const [wordCount, setWordCount] = useState(0); // For counting words
    const selectedPropertyName = propertyOptions.find(option => option.propertyId === selectedProperty)?.propertyname;


    // 1st useEffect: Check if the user is logged in when the component mounts
    useEffect(() => {
        setIsLoggedIn(isTokenValid());
        console.log("User ID:", getUserIdFromToken());

    }, []);

    useEffect(() => {
        console.log("User ID:", getUserIdFromToken());
    }, []); // This will run once when the component mounts

    // 2nd useEffect: Fetch landlord details based on the landlordId
    useEffect(() => {
        const fetchLandlordDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/landlord/details/${landlordId}`);
                
                // Assuming the API returns `name` and `properties` fields
                setLandlordName(response.data.name);
                setPropertyOptions(response.data.properties); // Assuming properties is an array of property names
            } catch (error) {
                console.error("Error fetching landlord details:", error);
            }
        };

        if (landlordId) {
            fetchLandlordDetails();
        }
    }, [landlordId]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/landlord/details/${landlordId}`);
                setPropertyOptions(response.data.properties);  // Ensure properties are set correctly
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };
    
        fetchProperties();
    }, [landlordId]);
    

    //navigate based on account status
    const handleAccountClick = () => {
        if (isLoggedIn) {
            // If logged in, navigate to the user account page
            navigate('/account');
        } else {
            // If not logged in, navigate to the sign-in page
            navigate('/signin');
        }
    };
    
    //toggle dropdown visibility
    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };
    
    //select dropdown property
    const handleOptionSelect = (option) => {
        setSelectedProperty(option.propertyId);  // Store propertyId for submission
        setDropdownOpen(false); // Close the dropdown after selection
    };
    
    //handle review text change
    const handleReviewChange = (e) => {
        const originalText = e.target.value;
        const words = originalText.trim().split(/\s+/); // Split text into words
        const count = words.filter(word => word !== "").length;
    
        if (count <= 300) { // Allow typing only if under the limit
            const censoredText = censorText(originalText); // Apply censoring
            setReviewText(censoredText);  // Update state with censored text
            setWordCount(count); // Update word count
        }
    };

    //to submit review
    const handleSubmit = async () => {
        if (!isChecked) {
            setCheckboxError(true); // Display error if checkbox is not checked
            return;
        }
    
        setCheckboxError(false); // Clear error if checkbox is checked
        const userId = getUserIdFromToken();
        console.log("User ID:", userId);
        const timestamp = new Date().toISOString(); // Generate the current timestamp in ISO format

        console.log("Submitting review with propertyId:", selectedProperty); // Log selectedProperty

    
        try {
            await axios.post('http://localhost:5000/api/landlord/addareview', {
                landlordId: landlordId,
                ratingId: Math.floor(Math.random() * 1000),
                score: selectedRating,
                comment: reviewText,
                maintenance: ratings.maintenance,
                pets: ratings.pets,
                safety: ratings.safety,
                raisemoney: ratings.raisemoney,
                reachable: ratings.reachable,
                clearcontract: ratings.clearcontract,
                recommend: ratings.recommend,
                userId: userId,
                timestamp: timestamp,  // Add timestamp to data
                propertyId: selectedProperty // Send propertyId to backend
            });
            alert('Review submitted successfully');
            navigate(`/LandlordProfile/${landlordId}`);
        } catch (error) {
            console.error("Error submitting review:", error.response?.data || error.message);
            alert('Failed to submit review');
        }
    };
    
    
    //validate and move to next step
    const handleNextClick = () => {
        if (!selectedProperty) setPropertyError(true); // Show error if no property selected
        if (selectedRating === 0) setRatingError(true); // Show error if no rating selected
    
        if (selectedProperty && selectedRating !== 0) {
            setCurrentStep(currentStep + 1); // Move to the next frame only if both fields are valid
        }
    };
    

    // Handle rating selection for each criterion with toggle functionality
    const handleRatingSelect = (key, value) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [key]: prevRatings[key] === value ? "No Response" : value
        }));
    };

    const handleSmileyClick = (rating) => {
        setSelectedRating(rating);
    };
    

    const [ratings, setRatings] = useState({
        maintenance: "No Response",
        pets: "No Response",
        safety: "No Response",
        raisemoney: "No Response",
        reachable: "No Response",
        clearcontract: "No Response",
        recommend: "No Response"
    });
    

    const Criterion = ({ name, icon, ratingKey, ratings, handleRatingSelect }) => (
        <div className="criteria">
            <img src={icon} alt={name} className="criterion-icon" />
            <p className="criterion-text">{name}</p>
            <div className="thumbs">
                <img src={ThumbsUp} alt="Thumbs Up" className={`thumb ${ratings[ratingKey] === 'Yes' ? 'selected' : ''}`} onClick={() => handleRatingSelect(ratingKey, 'Yes')} />
                <img src={ThumbsDown} alt="Thumbs Down" className={`thumb ${ratings[ratingKey] === 'No' ? 'selected' : ''}`} onClick={() => handleRatingSelect(ratingKey, 'No')} />
            </div>
        </div>
    );

    const CriterionReview = ({ name, rating, icon }) => (
        <div className="criteria">
            <img src={icon} alt={name} className="criterion-icon" />
            <p className="criterion-text">{name}</p>
            <div className="thumbs">
                {rating === 'Yes' ? (
                    <img src={ThumbsUp} alt="Thumbs Up" className="thumb selected" />
                ) : rating === 'No' ? (
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

    useEffect(() => {
        setIsLoggedIn(isTokenValid());
    }, []);

    const profaneWords = [
        "fucker", "fuck", "shit", "damn", "asshole", "bitch", "bastard", "dick", "piss", "crap", 
        "cunt", "prick", "slut", "whore", "cock", "douche", "motherfucker", "nigger", "kike", 
        "chink", "spic", "beaner","wop", "dyke", "fag", "faggot", "wanker", "twat", "retard", "idiot", 
        "moron", "scumbag", "shithead", "tits", "boobs", "balls", "dickhead", "ass", "arse","bugger", 
        "bollocks", "tosser", "shag", "slag", "skank", "jackass", "suck", "arsehole", "bloody", 
        "bollock", "bollocks", "bollocking", "git", "pussy", "minge", "nonce", "pikey", "sod", 
        "sodding", "wank", "bellend", "shite", "spaz", "twit", "choad", "knob", "wazzock", 
        "minger", "numpty", "pillock", "knobhead", "knob-end", "plonker", "queer", "wop", "boobies", 
        "gash", "smeg", "prat", "nonce", "chuffer"
    ];    

    const censorText = (text) => {
        const regex = new RegExp(`\\b(${profaneWords.join('|')})\\b`, 'gi');
        return text.replace(regex, (match) => '*'.repeat(match.length));
    };
    


    return (
        <div className="main-container-add-a-rating">
        {isLoggedIn ? (
            <SideMenu />
        ) : (
            <NoAccountSideMenu />
        )}

            {/* Header section */}
            <header className="headerhp-add-a-rating">
                <Link to="/" className="logohp-container-add-a-rating">
                    <img 
                        src={OfficialLogo} 
                        alt="Official Logo" 
                        className="center-logo-add-a-rating" 
                    />
                </Link>
                
                <div className="buttons-container-add-a-rating">
                    <Link to="/addalandlord">
                        <img
                            src={SubmitLandlordRate}
                            alt="Submit Landlord Rate"
                            className="left-icon"
                        />
                    </Link>
                    
                    <img
                        src={AccountButton}
                        alt="Account Button"
                        className="account-right"
                        onClick={handleAccountClick} // Use the click handler here
                        style={{ cursor: 'pointer' }} // change cursor to pointer
                    />
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
                        <h3>{landlordName}</h3>
                    </div>

                    <div className="write-a-review-string">
                        <h3>Write a Review:</h3>
                    </div>
                    <div className="review-box">
                    <textarea
                        placeholder="What do you want other tenants to know about this landlord?"
                        value={reviewText}  // Bind to reviewText state
                        onChange={handleReviewChange}  // Update state on change
                    />
                    <p className="word-counter">{wordCount}/300</p> {/* Word counter display */}

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
                    <div className="select-property-add-a-review"> 
                            <h4>* Select Property:</h4>

                    </div>
                    <div> 
                    <div className={`dropdown-container-add-a-review`}>
                    <div className="dropdown-selected-add-a-review" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <span>{selectedProperty 
                        ? propertyOptions.find(opt => opt.propertyId === selectedProperty)?.propertyname 
                        : "Select a Property"}</span>
                    <img
                                src={DownArrow}
                                alt="Down Arrow"
                                className={`down-arrow ${dropdownOpen ? 'open' : ''}`}
                            />
                        </div>

                        {dropdownOpen && (
                            <ul className="dropdown-options-add-a-review">
                                {propertyOptions.map((option, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleOptionSelect(option)}
                                        className="dropdown-item-add-a-review"
                                    >
                                        {option.propertyname}  {/* Display property name */}
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


                    {/* Moved Error Messages */}
                    <div className="error-container-1">
                        {propertyError && <p className="error-message-1">* Please select a property</p>}
                    </div>

                    <div className="error-containe-2">
                        {ratingError && <p className="error-message-2">* Please rate your landlord</p>}
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
                    className={`thumb ${ratings.maintenance === 'Yes' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('maintenance', 'Yes')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`thumb ${ratings.maintenance === 'No' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('maintenance', 'No')}
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
                    className={`thumb ${ratings.pets === 'Yes' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('pets', 'Yes')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`thumb ${ratings.pets === 'No' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('pets', 'No')}
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
                    className={`thumb ${ratings.safety === 'Yes' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('safety', 'Yes')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`thumb ${ratings.safety === 'No' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('safety', 'No')}
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
                    className={`thumb ${ratings.raisemoney === 'Yes' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('raisemoney', 'Yes')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`thumb ${ratings.raisemoney === 'No' ? 'selected' : ''}`}
                    onClick={() => handleRatingSelect('raisemoney', 'No')}
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
                                className={`thumb ${ratings.reachable === 'Yes' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('reachable', 'Yes')}
                            />
                            <img
                                src={ThumbsDown}
                                alt="Thumbs Down"
                                className={`thumb ${ratings.reachable === 'No' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('reachable', 'No')}
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
                                className={`thumb ${ratings.clearcontract === 'Yes' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('clearcontract', 'Yes')}
                            />
                            <img
                                src={ThumbsDown}
                                alt="Thumbs Down"
                                className={`thumb ${ratings.clearcontract === 'No' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('clearcontract', 'No')}
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
                                className={`thumb ${ratings.recommend === 'Yes' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('recommend', 'Yes')}
                            />
                            <img
                                src={ThumbsDown}
                                alt="Thumbs Down"
                                className={`thumb ${ratings.recommend === 'No' ? 'selected' : ''}`}
                                onClick={() => handleRatingSelect('recommend', 'No')}
                            />
                           
                        </div>
                    </div>
                </div>
            )}
{/* Frame 4 Content -------------------------------------------- */}
{currentStep === 4 && (
    <div class="frame4-background-container">
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
            <h3>{landlordName}</h3>
        </div>

        {/* Review Text Display */}
        <div className="frame-4-write-a-review-string">
            <h3>Review:</h3>
        </div>
        <div className="frame4-review-text">
            <p>{reviewText || "No review provided"}</p>
        </div>

        {/* Property Display */}
        {/* Property Display in Frame 4 */}
        <div className="frame4-select-property">
            <div className="frame4-label-container">
                <label>Property:</label>
            </div>
            <div className="frame4-dropdown-container">
                <span className="frame4-dropdown-selected">
                <div>{selectedPropertyName || "No property selected"}</div>
                </span>
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
            <CriterionReview name="Safe Area" rating={ratings.safety} icon={Safe} />
            <CriterionReview name="Raises Rent Yearly" rating={ratings.raisemoney} icon={Money} />
        </div>
        <div className="frame4-criterion-container-3">
            <CriterionReview name="Reachable & Responsive" rating={ratings.reachable} icon={Reachable} />
            <CriterionReview name="Clear & Fair Contract" rating={ratings.clearcontract} icon={Contract} />
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
                        <p className="error-message-checkbox">* Please check this box to submit your review</p>
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
    </div>
)}

{/* Button for frame 1 (Next Button) */}
{currentStep === 1 && (
    <button className="next-btn-frame1" 
    onClick={handleNextClick}>
    <img src={NextButton} alt="Next" />
</button>

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
