import React, { useEffect, useState } from 'react';

import OfficialLogo from '../Assets/official logo.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
//import SideMenu from './SideMenu';
import Header from './Header';
import NoAccountSideMenu from './NoAccountSideMenu';
import AccountButton from '../Assets/Account button.svg';
import AddRatingTitle from '../Assets/add-rating-title.svg';
import DownArrow from '../Assets/downward.svg'; // Use the downward arrow SVG
import Face1 from '../Assets/face-1.svg';
import Face2 from '../Assets/face-2.svg';
import Face3 from '../Assets/face-3.svg';
import Face4 from '../Assets/face-4.svg';
import Face5 from '../Assets/face-5.svg';
import GrayFace1 from '../Assets/s-1.svg';
import GrayFace2 from '../Assets/s-2.svg';
import GrayFace3 from '../Assets/s-3.svg';
import GrayFace4 from '../Assets/s-4.svg';
import GrayFace5 from '../Assets/s-5.svg';
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
import CheckIcon from '../Assets/checkbox-selected.svg';
import axios from 'axios';
import { getUserIdFromToken, isTokenValid } from './authentication';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';//this is needed to get landlordID:
import styles from './AddAReview.module.css';


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
    const { landlordId, ratingId } = useParams();//this gets the landlordId from the URL,rating id
    const [wordCount, setWordCount] = useState(0); // For counting words
    const selectedPropertyName = propertyOptions.find(option => option.propertyId === selectedProperty)?.propertyname;
    const [existingReview, setExistingReview] = useState(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const [scale, setScale] = useState(1); // Track the current scale

    // Function to calculate the scale dynamically
    const handleResize = () => {
        const container = document.querySelector(`.${styles['main-container-add-a-rating']}`);
        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight;

        const contentWidth = 995; // Your base design width
        const contentHeight = 380; // Your base design height

        // Calculate the scale factor, but limit it to a maximum of 1
        const newScale = Math.min(
            availableWidth / contentWidth,
            availableHeight / contentHeight,
            1 // Ensure it doesn't zoom in beyond the original size
        );
        setScale(newScale);
        };

    useEffect(() => {
        handleResize(); // Initial calculation
        window.addEventListener('resize', handleResize); // Recalculate on resize
        return () => window.removeEventListener('resize', handleResize); // Cleanup
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (ratingId) {
                    // If editing, ensure the user is signed in
                    if (!isTokenValid()) {
                        console.log("User is not logged in. Redirecting...");
                        navigate('/signin');
                        return;
                    }
    
                    const reviewResponse = await axios.get(`http://localhost:5000/api/review/${ratingId}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
    
                    const reviewData = reviewResponse.data;
                    setExistingReview(reviewData);
                    setSelectedRating(reviewData.score);
                    setReviewText(reviewData.comment);
                    setSelectedProperty(reviewData.propertyId);
                    setRatings({
                        maintenance: reviewData.maintenance,
                        pets: reviewData.pets,
                        safety: reviewData.safety,
                        raisemoney: reviewData.raisemoney,
                        reachable: reviewData.reachable,
                        clearcontract: reviewData.clearcontract,
                        recommend: reviewData.recommend,
                    });
                }
    
                if (landlordId) {
                    const landlordResponse = await axios.get(`http://localhost:5000/api/landlord/details/${landlordId}`);
                    setLandlordName(landlordResponse.data.name);
                    setPropertyOptions(landlordResponse.data.properties);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
    
                if (error.response?.status === 403) {
                    alert("You are not authorized to edit this review.");
                    navigate('/'); // Redirect unauthorized users to the homepage
                } else if (error.response?.status === 401) {
                    alert("Session expired. Please log in again.");
                    navigate('/signin');
                } else {
                    alert("An error occurred while loading the page.");
                    navigate('/'); // Redirect unauthorized users to the homepage

                }
            }
        };
    
        fetchData();
    }, [ratingId, landlordId, navigate]);
    
    

    const isTokenValid = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
    
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime; // Check expiration
        } catch (e) {
            return false;
        }
    };
    
    

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
    
        if (count <= 150) { // Allow typing only if under the limit
            const censoredText = censorText(originalText); // Apply censoring
            setReviewText(censoredText);  // Update state with censored text
            setWordCount(count); // Update word count
        }
    };

    const handleSubmit = async () => {
        if (!isChecked) {
            setCheckboxError(true); // Display error if checkbox is not checked
            return;
        }
    
        setCheckboxError(false); // Clear error if checkbox is checked
        const userId = isLoggedIn ? getUserIdFromToken() : null; // Only include userId if logged in
        const timestamp = new Date().toISOString(); // Generate the current timestamp in ISO format
    
        console.log("Submitting review with propertyId:", selectedProperty); // Log selectedProperty
    
        const reviewData = {
            landlordId: parseInt(landlordId, 10), // Convert landlordId to integer
            ratingId: ratingId ? parseInt(ratingId, 10) : Math.floor(Math.random() * 1000), // Ensure ratingId is an integer
            score: selectedRating,
            comment: reviewText,
            maintenance: ratings.maintenance,
            pets: ratings.pets,
            safety: ratings.safety,
            raisemoney: ratings.raisemoney,
            reachable: ratings.reachable,
            clearcontract: ratings.clearcontract,
            recommend: ratings.recommend,
            userId,
            timestamp,  // Add timestamp to data
            propertyId: parseInt(selectedProperty, 10), // Convert propertyId to integer
        };
    
        try {
            const url = ratingId 
                ? `http://localhost:5000/api/review/${ratingId}/update`
                : 'http://localhost:5000/api/landlord/addareview';
            
            const method = ratingId ? 'put' : 'post';
    
            // Add the Authorization header to the request
            const headers = isLoggedIn
                ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
                : {};
    
            await axios[method](url, reviewData, { headers });
            alert('Review saved successfully');
            navigate(`/LandlordProfile/${landlordId}`);
        } catch (error) {
            console.error("Error saving review:", error.response?.data || error.message);
            alert('Failed to save review');
        }
    };
    

const MyRatings = () => {
    const navigate = useNavigate();

    const handleEditClick = (landlordId, ratingId) => {
        navigate(`/AddAReview/${landlordId}/${ratingId}`);
    };

    return (
        <div>
            {/* Example Edit Button */}
            <button onClick={() => handleEditClick('landlord123', 'rating456')}>
                Edit Review
            </button>
        </div>
    );
};

const LandlordProfile = ({ landlordId }) => {
    const navigate = useNavigate();

    const handleAddReviewClick = () => {
        navigate(`/AddAReview/${landlordId}`);
    };

    return (
        <div>
            {/* Example Add Review Button */}
            <button onClick={handleAddReviewClick}>
                Add a Review
            </button>
        </div>
    );
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
        <div className={styles.criteria}>
            <img src={icon} alt={name} className={styles["criterion-icon"]} />
            <p className={styles["criterion-text"]}>{name}</p>
            <div className={styles.thumbs}>
            <img
                src={ThumbsUp}
                alt="Thumbs Up"
                className={`${styles.thumb} ${ratings[ratingKey] === 'Yes' ? styles.selected : ''}`}
                onClick={() => handleRatingSelect(ratingKey, 'Yes')}
            />
            <img
                src={ThumbsDown}
                alt="Thumbs Down"
                className={`${styles.thumb} ${ratings[ratingKey] === 'No' ? styles.selected : ''}`}
                onClick={() => handleRatingSelect(ratingKey, 'No')}
            />
            </div>
        </div>
    );

    const CriterionReview = ({ name, rating, icon }) => (
        <div className={styles.criteria}>
            <img src={icon} alt={name} className={styles["criterion-icon"]} />
            <p className={styles["criterion-text"]}>{name}</p>
            <div className={styles.thumbs}>
                {rating === 'Yes' ? (
                    <img src={ThumbsUp} alt="Thumbs Up" className={`${styles.thumb} ${styles.selected}`} />
                ) : rating === 'No' ? (
                    <img src={ThumbsDown} alt="Thumbs Down" className={`${styles.thumb} ${styles.selected}`} />
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

    const formatLandlordName = (name) => {
        if (!name) return '';
        const [firstName, lastName] = name.split(' '); // Split into first and last name
        return (
            <span style={{ whiteSpace: 'nowrap' }}>
                {firstName} {lastName}
            </span>
        );
    };
    
    
    


    return (
        <div className={styles["main-container-add-a-rating"]}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}

        >
            {/* Prompt for Editing Access */}
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />


                {/* Prompt for Editing Access */}
                {ratingId && !isLoggedIn && (
                    <p className={styles["signin-prompt"]}>
                        You must be signed in to edit your review. <Link to="/signin">Sign in</Link>
                    </p>
                )}

{/**Frame 1 ----------------------------------------------- */}
{       currentStep === 1 && (
            <div className={styles["form-container-add-a-rating"]}>
                <div className={styles["add-rating-image"]}>
                    <h1>
                        <img
                            src={AddRatingTitle}
                            alt="Add Rating Title"
                            className={styles["add-rating-title"]}
                        />
                    </h1>
                </div>
                <div className={styles["you-are-rating"]}>
                    <h2>You are Rating:</h2>
                </div>

                
                <div className={styles["you-are-rating-landlord-name-container"]}>
                    <div className={styles["you-are-rating-landlord-name"]}>
                        <h3>{formatLandlordName(landlordName)}</h3>
                    </div>
                </div>



                <div className={styles["write-a-review-string"]}>
                    <h3>Write a Review:</h3>
                </div>
                <div className={styles["review-box"]}>
                    <textarea
                        placeholder="What do you want other tenants to know about this landlord?"
                        value={reviewText}  // Bind to reviewText state
                        onChange={handleReviewChange}  // Update state on change
                    />
                    <p className={styles["word-counter"]}>{wordCount} / 150 Words</p> {/* Word counter display */}
                </div>

                <div className={styles.guidelines}>
                    <div className={styles["guidelines-string"]}>
                        <h3>Guidelines</h3>
                    </div>
                    <div className={styles["guidelines-rules"]}>
                        <ul>
                            <li>- No use of profanity or derogatory terms</li>
                            <li>- Be honest and specific</li>
                            <li>- Stay professional and respectful</li>
                            <li>- Protect your privacy</li>
                        </ul>
                    </div>
                </div>


                    {/* Select Property Section */}
                    <div className={styles["select-property-add-a-review"]}>
                        <h4>* Select Property:</h4>
                    </div>


                    <div> 
                    <div className={styles["dropdown-container-add-a-review"]}>
                    <div
                        className={styles["dropdown-selected-add-a-review"]}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span>
                            {selectedProperty
                                ? propertyOptions.find(opt => opt.propertyId === selectedProperty)?.propertyname
                                : "Select a Property"}
                        </span>
                        <img
                            src={DownArrow}
                            alt="Down Arrow"
                            className={`${styles["down-arrow"]} ${dropdownOpen ? styles.open : ""}`}
                        />
                    </div>

                    {dropdownOpen && (
                        <ul className={styles["dropdown-options-add-a-review"]}>
                            {propertyOptions.map((option, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleOptionSelect(option)}
                                    className={styles["dropdown-item-add-a-review"]}
                                >
                                    {option.propertyname} {/* Display property name */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                        
                    </div>

                    <div className={styles["rate-your-landlord-string"]}>
                        <h4>* Rate Your Landlord:</h4>
                    </div>

                    <div className={styles["rating-icons"]}>
                        {[Face1, Face2, Face3, Face4, Face5].map((face, index) => (
                            <img
                                key={index}
                                src={
                                    selectedRating >= index + 1
                                        ? face
                                        : [GrayFace1, GrayFace2, GrayFace3, GrayFace4, GrayFace5][index]
                                }
                                alt={`Rating ${index + 1}`}
                                className={styles["rating-icon"]}
                                onClick={() => handleSmileyClick(index + 1)}
                            />
                        ))}
                    </div>


                    {/* Moved Error Messages */}
                    <div className={styles["error-container-1"]}>
                        {propertyError && (
                            <p className={styles["error-message-1"]}>* Please select a property</p>
                        )}
                    </div>

                    <div className={styles["error-container-2"]}>
                        {ratingError && (
                            <p className={styles["error-message-2"]}>* Please rate your landlord</p>
                        )}
                    </div>


                </div>
            )}

{/* Frame 2 Content ----------------------------------------------*/}
{currentStep === 2 && (
    <div className={styles["rating-criteria-container"]}>
        {/* Maintenance Criterion */}
        <div className={styles.criteria}>
            <img src={Maintenance} alt="Maintenance" className={styles["criterion-icon"]} />
            <p className={styles["criterion-text"]}>Timely Maintenance</p>
            <div className={styles.thumbs}>
                <img
                    src={ThumbsUp}
                    alt="Thumbs Up"
                    className={`${styles.thumb} ${ratings.maintenance === 'Yes' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('maintenance', 'Yes')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`${styles.thumb} ${ratings.maintenance === 'No' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('maintenance', 'No')}
                />
            </div>
        </div>

        {/* Pets Criterion */}
        <div className={styles.criteria}>
            <img src={Pets} alt="Allows Pets" className={styles["criterion-icon"]} />
            <p className={styles["criterion-text"]}>Allows Pets</p>
            <div className={styles.thumbs}>
                <img
                    src={ThumbsUp}
                    alt="Thumbs Up"
                    className={`${styles.thumb} ${ratings.pets === 'Yes' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('pets', 'Yes')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`${styles.thumb} ${ratings.pets === 'No' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('pets', 'No')}
                />
            </div>
        </div>

        {/* Safe Area Criterion */}
        <div className={styles.criteria}>
            <img src={Safe} alt="Safe Area" className={styles["criterion-icon"]} />
            <p className={styles["criterion-text"]}>Safe Area</p>
            <div className={styles.thumbs}>
                <img
                    src={ThumbsUp}
                    alt="Thumbs Up"
                    className={`${styles.thumb} ${ratings.safety === 'Yes' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('safety', 'Yes')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`${styles.thumb} ${ratings.safety === 'No' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('safety', 'No')}
                />
            </div>
        </div>

        {/* Raise Rent Criterion */}
        <div className={styles.criteria}>
            <img src={Money} alt="Raise Rent Yearly" className={styles["criterion-icon"]} />
            <p className={styles["criterion-text"]}>Fair Rent Increases</p>
            <div className={styles.thumbs}>
                <img
                    src={ThumbsUp}
                    alt="Thumbs Up"
                    className={`${styles.thumb} ${ratings.raisemoney === 'Yes' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('raisemoney', 'Yes')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`${styles.thumb} ${ratings.raisemoney === 'No' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('raisemoney', 'No')}
                />
            </div>
        </div>
    </div>
)}

{/* Frame 3 Content ---------------------------------------------- */}
{currentStep === 3 && (
    <div className={styles["rating-criteria-container"]}>
        {/* Reachable & Responsive Criterion */}
        <div className={styles.criteria}>
            <img src={Reachable} alt="Reachable & Responsive" className={styles["criterion-icon"]} />
            <p className={styles["criterion-text"]}>Reachable & Responsive</p>
            <div className={styles.thumbs}>
                <img
                    src={ThumbsUp}
                    alt="Thumbs Up"
                    className={`${styles.thumb} ${ratings.reachable === 'Yes' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('reachable', 'Yes')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`${styles.thumb} ${ratings.reachable === 'No' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('reachable', 'No')}
                />
            </div>
        </div>

        {/* Clear & Fair Contract Criterion */}
        <div className={styles.criteria}>
            <img src={Contract} alt="Clear & Fair Contract" className={styles["criterion-icon"]} />
            <p className={styles["criterion-text"]}>Clear & Fair Contract</p>
            <div className={styles.thumbs}>
                <img
                    src={ThumbsUp}
                    alt="Thumbs Up"
                    className={`${styles.thumb} ${ratings.clearcontract === 'Yes' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('clearcontract', 'Yes')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`${styles.thumb} ${ratings.clearcontract === 'No' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('clearcontract', 'No')}
                />
            </div>
        </div>

        {/* Would you recommend to others? Criterion */}
        <div className={styles.criteria}>
            <img src={Recommend} alt="Would you recommend to others?" className={styles["criterion-icon"]} />
            <p className={styles["criterion-text"]}>Would you recommend?</p>
            <div className={styles.thumbs}>
                <img
                    src={ThumbsUp}
                    alt="Thumbs Up"
                    className={`${styles.thumb} ${ratings.recommend === 'Yes' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('recommend', 'Yes')}
                />
                <img
                    src={ThumbsDown}
                    alt="Thumbs Down"
                    className={`${styles.thumb} ${ratings.recommend === 'No' ? styles.selected : ''}`}
                    onClick={() => handleRatingSelect('recommend', 'No')}
                />
            </div>
        </div>
    </div>
)}

{/* Frame 4 Content -------------------------------------------- */}
{currentStep === 4 && (
    <div className={styles["frame4-background-container"]}>
        <div className={styles["frame4-container"]}>
            {/* Header and Landlord Info */}
            <div className={styles["frame-4-add-rating-image"]}>
                <h1>
                    <img
                        src={AddRatingTitle}
                        alt="Add Rating Title"
                        className={styles["add-rating-title"]}
                    />
                </h1>
            </div>
            
            <div className={styles["frame-4-you-are-rating"]}>
                <h2>You Are Rating:</h2>
            </div>
            
            <div className={styles["frame-4-you-are-rating-landlord-name-container"]}>
                <div className={styles["frame-4-you-are-rating-landlord-name"]}>
                    <h3>{formatLandlordName(landlordName)}</h3>
                </div>
            </div>


            {/* Review Text Display */}
            <div className={styles["frame-4-write-a-review-string"]}>
                <h3>Review:</h3>
            </div>
            <div className={styles["frame4-review-text"]}>
                <p>{reviewText || "No review provided"}</p>
            </div>

            {/* Property Display */}
            <div className={styles["frame4-select-property"]}>
                <div className={styles["frame4-label-container"]}>
                    <label>Property:</label>
                </div>
                <div className={styles["frame4-dropdown-container"]}>
                    <span className={styles["frame4-dropdown-selected"]}>
                        <div>{selectedPropertyName || "No property selected"}</div>
                    </span>
                </div>
            </div>

            {/* Overall Rating Icons */}
            <div className={styles["frame-4-rate-your-landlord-string"]}>
                <h4>Your Rating:</h4>
            </div>
            <div className={styles["frame4-rating-icons"]}>
                {[Face1, Face2, Face3, Face4, Face5].map((face, index) => (
                    <img
                        key={index}
                        src={
                            selectedRating >= index + 1
                                ? face // Use the active face
                                : [GrayFace1, GrayFace2, GrayFace3, GrayFace4, GrayFace5][index] // Use the inactive gray face
                        }
                        alt={`Rating ${index + 1}`}
                        className={styles["rating-icon"]}
                    />
                ))}
            </div>


            {/* Criterion Ratings */}
            <div className={styles["frame4-criterion-container-4"]}>
                <CriterionReview name="Timely Maintenance" rating={ratings.maintenance} icon={Maintenance} />
                <CriterionReview name="Allows Pets" rating={ratings.pets} icon={Pets} />
                <CriterionReview name="Safe Area" rating={ratings.safety} icon={Safe} />
                <CriterionReview name="Fair Rent Increases" rating={ratings.raisemoney} icon={Money} />
            </div>
            <div className={styles["frame4-criterion-container-3"]}>
                <CriterionReview name="Reachable & Responsive" rating={ratings.reachable} icon={Reachable} />
                <CriterionReview name="Clear & Fair Contract" rating={ratings.clearcontract} icon={Contract} />
                <CriterionReview name="Would you recommend?" rating={ratings.recommend} icon={Recommend} />
            </div>

            {/* Checkbox Section */}
            <div className={styles["checkbox-container"]}>
                <label>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    I confirm that my review is truthful and based on my personal experience.
                </label>
                <p className={styles["error-message-checkbox"]}>* Please check this box to submit your review</p>
            </div>

            {/* Buttons for Frame 4 */}
            <div className={styles["frame4-buttons-container"]}>
                <div className={styles["frame4-back-container"]}>
                    <button
                        className={styles["frame4-back-btn"]}
                        onClick={() => setCurrentStep(currentStep - 1)}
                    >
                        <img src={BackButton} alt="Back" />
                    </button>
                </div>

                <div className={styles["frame4-submit-container"]}>
                    <button
                        className={styles["frame4-submit-btn"]}
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
    <button className={styles["next-btn-frame1"]} 
    onClick={handleNextClick}>
        <img src={NextButton} alt="Next" />
    </button>
)}

{/* Button Row for frames 2 and 3 */}
{currentStep > 1 && currentStep < 4 && (
    <div className={styles["button-row"]}>
        <button
            className={styles["back-btn"]}
            onClick={() => setCurrentStep(currentStep - 1)}
        ></button>
        <button
            className={styles["next-btn"]}
            onClick={() => setCurrentStep(currentStep + 1)}
        ></button>
    </div>
)}

  
    </div>
    ); 
};

export default AddAReview;
