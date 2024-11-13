
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import LandlordIcon from '../Assets/landlord-title-logo.svg';
import Bookmark from '../Assets/mybookmark-title.svg';
import SelectedBookmark from '../Assets/saved-bookmark.svg';
import GreenButton from '../Assets/green.svg';
import RedButton from '../Assets/red.svg';
import ExcellentFace from '../Assets/face-5.svg';
import GoodFace from '../Assets/face-4.svg';
import AverageFace from '../Assets/face-3.svg';
import DecentFace from '../Assets/face-2.svg';
import PoorFace from '../Assets/face-1.svg';
import Share from '../Assets/share.svg';
import Report from '../Assets/report.svg';
import GreyThumbsUp from '../Assets/up-grey.svg';
import GreyThumbsDown from '../Assets/down-grey.svg';
import GreenThumbsUp from '../Assets/up-selected.svg';
import RedThumbsDown from '../Assets/down-selected.svg';

import NoAccountSideMenu from './NoAccountSideMenu';
import SideMenu from './SideMenu';
import './LandlordProfile.css';
import { isTokenValid } from './authentication';

function LandlordProfile() {
    const { landlordId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [bookmarked, setBookmarked] = useState({});
    const [landlordData, setLandlordData] = useState({});
    const [isThumbsUpSelected, setIsThumbsUpSelected] = useState(false);
    const [isThumbsDownSelected, setIsThumbsDownSelected] = useState(false);
    const [sortOrder, setSortOrder] = useState("mostRecent");

    const navigate = useNavigate();

    // Check if properties data is available before attempting to access it
    const property = landlordData.properties && landlordData.properties.length > 0 ? landlordData.properties[0] : null;
    const propertyLocation = property 
        ? `${property.propertyname} at ${property.address}, ${property.city}, ${property.state}`
        : "Location not available";

    useEffect(() => {
        fetch(`/api/landlord/${landlordId}`)
            .then(response => response.json())
            .then(data => setLandlordData(data))
            .catch(error => console.error(error));
    }, [landlordId]);

    useEffect(() => {
        if (isTokenValid()) {
            setIsLoggedIn(true);
        }
    }, []);

    const toggleBookmark = (landlordId) => {
        if (!isLoggedIn) {
            alert('Please log in to bookmark landlords.');
            navigate('/SignIn');
            return;
        }

        const isBookmarked = bookmarked[landlordId];
        setBookmarked(prev => ({ ...prev, [landlordId]: !isBookmarked }));
    };

    // Handler for thumbs up
    const handleThumbsUpClick = () => {
        if (isThumbsUpSelected) {
            // If already selected, deselect
            setIsThumbsUpSelected(false);
        } else {
            // Select thumbs up and deselect thumbs down
            setIsThumbsUpSelected(true);
            setIsThumbsDownSelected(false);
        }
    };

    // Handler for thumbs down
    const handleThumbsDownClick = () => {
        if (isThumbsDownSelected) {
            // If already selected, deselect
            setIsThumbsDownSelected(false);
        } else {
            // Select thumbs down and deselect thumbs up
            setIsThumbsDownSelected(true);
            setIsThumbsUpSelected(false);
        }
    };

    const handleAddPropertyClick = () => {
        navigate(`/addproperty/${landlordId}`);
    };

    //navigation to review
    const handleAddReviewClick =()=>{
        navigate(`/AddAReview/${landlordId}`);  //this navigates to addareview with the landlordID
    };
    //This navigates to report page
    const handleReportClick = () => {
        navigate(`/ReportProblem/${landlordId}`); // Navigate to the report page with landlord ID
    };

    const handleReportReviewClick =() =>{
        navigate(`/ReportReview/${landlordId}`);
    }

    //Bar graph:
    const { ratingDistribution = {}, reviewCount = 0 } = landlordData; // Default to empty object if undefined

    // LandlordProfile.js
    const getBarWidth = (count) => {
        const width= reviewCount ? (count / reviewCount) * 100 : 0;
        console.log(`Width for count ${count}: ${width}%`);
        return width;
    };

     // Log the ratingDistribution to verify values
    console.log("Rating Distribution:", ratingDistribution);

    //SORTING 
    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
        console.log("Selected Sort Order:", e.target.value);

    };
    
    const sortedReviews = landlordData.reviews
    ? [...landlordData.reviews].sort((a, b) => {
        if (sortOrder === "highestRating") {
            return b.score - a.score; // Sort by highest score first
        } else if (sortOrder === "lowestRating") {
            return a.score - b.score; // Sort by lowest score first
        } else {
            return new Date(b.date) - new Date(a.date); // Default to most recent first
        }
    })
    : [];



    console.log(sortedReviews)

    return (
        <div className="landlord-profile-container">
            <header className="landlord-header">
                {isLoggedIn ? <SideMenu /> : <NoAccountSideMenu />}

                {/* Header */}
                <div className="landlord-logo-container">
                    <img src={OfficialLogo} alt="Official Logo" className="landlord-center-logo" onClick={() => navigate('/')} />
                </div>
                <div className="landlord-buttons-container">
                    <img src={SubmitLandlordRate} alt="Submit Landlord Rate" className="landlord-left-icon" />
                    <img src={AccountButton} alt="Account Button" className="landlord-account-right" onClick={() => {
                        isTokenValid() ? navigate('/myaccount') : navigate('/signin');
                    }} />
                </div>
            </header>

            {/* Landlord Information Section */}
            <div className="landlord-info">
                <img src={LandlordIcon} alt="Landlord Icon" className="middle-icon" />

                <div className="landlord-information">
                    <div className="landlord-details">
                        <div className="rating-box">
                            <p className="landlord-rates">{landlordData.averageRating ? landlordData.averageRating.toFixed(1):"No Ratings"}</p>
                        </div>
                        <div>
                            <h2 className="landlord-name">{landlordData.name}</h2>
                            <p className="landlord-location">{propertyLocation}</p>
                        </div>
                        <div className="landlord-bookmark-icon" onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(landlordId);
                        }}>
                            <img src={bookmarked[landlordId] ? SelectedBookmark : Bookmark} alt="Bookmark Icon" className="bookmark-icon-img" />
                        </div>
                        <div className='landlord-report-icon'>
                            <img
                        src={Report}
                        alt="Report"
                        className="report-icon-img"
                        onClick={handleReportClick} // Add click event to navigate
                            />
                        </div>
                        
                    </div>

                    <div className="button-container">
                        <button className="green-button" onClick={handleAddReviewClick}>
                            <img src={GreenButton} alt="Add Review" />
                            <span className="green-text">Add a Review</span>
                        </button>
                        <button className="red-button" onClick={handleAddPropertyClick}>
                            <img src={RedButton} alt="Add a Property" />
                            <span className="red-text">Add a Property</span>
                        </button>
                    </div>

                </div>

                {/* Rating Summary */}
                <div className="rating-summary">
                {[
                    { label: "Excellent", icon: ExcellentFace, count: ratingDistribution.Excellent || 0, colorClass: "green-bar" },
                    { label: "Good", icon: GoodFace, count: ratingDistribution.Good || 0, colorClass: "green-bar" },
                    { label: "Average", icon: AverageFace, count: ratingDistribution.Average || 0, colorClass: "yellow-bar" },
                    { label: "Decent", icon: DecentFace, count: ratingDistribution.Decent || 0, colorClass: "orange-bar" },
                    { label: "Poor", icon: PoorFace, count: ratingDistribution.Poor || 0, colorClass: "red-bar" },
                ].map((rating) => (
                    <div className="rating-item" key={rating.label}>
                        <img src={rating.icon} alt={rating.label} className="rating-face" />
                        <span className="rating-label">{rating.label}</span>
                        <div className="rating-bar grey-bar">
                            <div className={`${rating.colorClass}`} style={{ width: `${getBarWidth(rating.count)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
                
            </div>
            {/* Dropdowns for Select Property and Sort By */}
            <div className="dropdown-container">
                <div className="dropdown">
                    <label htmlFor="propertySelect">Select Property:</label>
                    <select id="propertySelect" name="propertySelect">
                    {landlordData.properties && landlordData.properties.length > 0 ? (
                    landlordData.properties.map((property) => (
                        <option key={property.propertyId} value={property.propertyId}>
                            {property.propertyname}
                        </option>
                            ))
                        ) : (
                            <option>No properties available</option>
                        )}
                        {/* Add more options as needed */}
                    </select>
                </div>

                <div className="dropdown">
                    <label htmlFor="sortSelect">Sort By:</label>
                    <select id="sortSelect" name="sortSelect" value={sortOrder} onChange={handleSortChange}>
                    <option value="mostRecent">Most Recent</option>
                        <option value="highestRating">Highest Rating</option>
                        <option value="lowestRating">Lowest Rating</option>
                        {/* Add more sorting options as needed */}
                    </select>
                </div>
            </div>
            <div className="reviews-and-icons">
                {/* Reviews Section */}
                <div className="reviews-section">
                    <div className="reviews-header-and-card">

                        {/* Total Reviews Text */}
                        
                            <h2>Total Reviews: {landlordData.reviewCount || 0}</h2>
                            {sortedReviews.map(review => (
                            

                        
                        <div key ={review.ratingId} className="review-card">
                            {/* Left Column containing the score and review details */}
                            <div className="left-column">
                                <div className="review-rating">
                                    <p className="score-text">{review.score}/5</p>
                                </div>
                                <div className="review-details">
                                    <div className={review.maintenance === "Yes"?"green":"red"}>Timely Maintenance</div>
                                    <div className={review.pets === "Yes"?"green":"red"}>Allow Pets</div>
                                    <div className={review.safety==="Yes"?"green":"red"}>Safe Area</div>
                                    <div className={review.raisemoney === "Yes"?"green":"red"}>Raise Rent Yearly</div>
                                    <div className={review.reachable === "Yes"? "green":"red"}>Reachable</div>
                                    <div className={review.clearcontract === "Yes"?"green":"red"}>Clear & Fair Contract</div>
                                </div>
                            </div>
                            {/* Right Column containing the comment section */}
                            <div className="comment-container">
                                <div className="comment-header">
                                    <div className="address-container">
                                        <h2>{property.propertyname}</h2>
                                        <p>{property.address}, {property.city}, {property.state} {property.zipcode}</p>
                                    </div>

                                    <div className="helpful-container">
                                        <span>Helpful:</span>
                                        <img
                                            src={isThumbsUpSelected ? GreenThumbsUp : GreyThumbsUp}
                                            alt="Thumbs Up"
                                            className="thumb-icon"
                                            onClick={handleThumbsUpClick}
                                        />
                                        <img
                                            src={isThumbsDownSelected ? RedThumbsDown : GreyThumbsDown}
                                            alt="Thumbs Down"
                                            className="thumb-icon"
                                            onClick={handleThumbsDownClick}
                                        />
                                    </div>
                                </div>

                                <div className="review-text">
                                    <p>{review.comment}</p>
                                </div>

                                <div className="recommend-container">
                                    <p>Recommend:</p>
                                    {review.recommend === "No Response"?(
                                        <span className="black">No Response</span>
                                    ):(
                                        <>
                                            <button
                                                    className={`recommend-button ${review.recommend === 'Yes' ? 'selected' : ''}`}
                                                >
                                                    Yes
                                            </button>
                                                <button
                                                    className={`recommend-button ${review.recommend === 'No' ? 'selected' : ''}`}
                                                >
                                                    No
                                                </button>
                                                </>
                                        
                                    )}
                                    
                                </div>

                                <span className="review-date">{new Date(review.timestamp).toLocaleDateString()}</span>
                                {/* Icons Container for Share and Report */}
                                <div className="icons-container">
                                    <img src={Share} alt="Share" className="icon share-icon" />
                                    <img src={Report} alt="Report" className="icon report-icon" onClick={handleReportReviewClick}/>
                                    
                                </div>
                            </div>
                                 
                        </div>
                        
                         ))}
                    </div>
               
                </div>
           
                  

                
            </div>
           


        </div>
    );
}


export default LandlordProfile;
