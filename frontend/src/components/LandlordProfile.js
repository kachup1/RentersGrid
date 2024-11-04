
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
    const navigate = useNavigate();

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
        navigate('/addproperty'); // Assuming '/add-property' is the route for AddProperty.js
    };


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
                            <p className="landlord-rates">2</p>
                        </div>
                        <div>
                            <h2 className="landlord-name">Alicia Keys</h2>
                            <p className="landlord-location">Landlord in Pine Plaza at Long Beach, CA</p>
                        </div>
                        <div className="landlord-bookmark-icon" onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(landlordId);
                        }}>
                            <img src={bookmarked[landlordId] ? SelectedBookmark : Bookmark} alt="Bookmark Icon" className="bookmark-icon-img" />
                        </div>
                    </div>

                    <div className="button-container">
                        <button className="green-button">
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
                    <div className="rating-item">
                        <img src={ExcellentFace} alt="Excellent" className="rating-face" />
                        <span className="rating-label">Excellent</span>
                        <div className="rating-bar grey-bar"></div>
                    </div>
                    <div className="rating-item">
                        <img src={GoodFace} alt="Good" className="rating-face" />
                        <span className="rating-label">Good</span>
                        <div className="rating-bar grey-bar"></div>
                    </div>
                    <div className="rating-item">
                        <img src={AverageFace} alt="Average" className="rating-face" />
                        <span className="rating-label">Average</span>
                        <div className="rating-bar grey-bar"></div>
                    </div>
                    <div className="rating-item">
                        <img src={DecentFace} alt="Decent" className="rating-face" />
                        <span className="rating-label">Decent</span>
                        <div className="rating-bar green-bar"></div>
                    </div>
                    <div className="rating-item">
                        <img src={PoorFace} alt="Poor" className="rating-face" />
                        <span className="rating-label">Poor</span>
                        <div className="rating-bar grey-bar"></div>
                    </div>
                </div>
            </div>
            {/* Dropdowns for Select Property and Sort By */}
            <div className="dropdown-container">
                <div className="dropdown">
                    <label htmlFor="propertySelect">Select Property:</label>
                    <select id="propertySelect" name="propertySelect">
                        <option value="FairviewApartment">Fairview Apartment</option>
                        <option value="OceanView">Ocean View</option>
                        <option value="SunsetVilla">Sunset Villa</option>
                        {/* Add more options as needed */}
                    </select>
                </div>

                <div className="dropdown">
                    <label htmlFor="sortSelect">Sort By:</label>
                    <select id="sortSelect" name="sortSelect">
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
                        <div className="total-reviews">
                            <h2>Total Reviews: 1</h2>
                        </div>
                        <div className="review-card">
                            {/* Left Column containing the score and review details */}
                            <div className="left-column">
                                <div className="review-rating">
                                    <p className="score-text">2/5</p>
                                </div>
                                <div className="review-details">
                                    <div className="maintenance-container">Timely Maintenance</div>
                                    <div className="pets-container">Allow Pets</div>
                                    <div className="safety-container">Safe Area</div>
                                    <div className="raise-rent-container">Raise Rent Yearly</div>
                                    <div className="reachable-container">Reachable & Responsive</div>
                                    <div className="contract-container">Clear & Fair Contract</div>
                                </div>
                            </div>
                            {/* Right Column containing the comment section */}
                            <div className="comment-container">
                                <div className="comment-header">
                                    <div className="address-container">
                                        <h2>Park Montair</h2>
                                        <p>4550 Montair Ave, Long Beach, CA 90808</p>
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
                                    <p>Landlord is not reachable</p>
                                </div>

                                <div className="recommend-container">
                                    <p>Recommend:</p>
                                    <button className="recommend-button">Yes</button>
                                    <button className="recommend-button">No</button>
                                </div>

                                <span className="review-date">September 3, 2023</span>
                            </div>


                        </div>
                    </div>
                </div>

                {/* Icons Container for Share and Report */}
                <div className="icons-container">
                    <img src={Share} alt="Share" className="icon share-icon" />
                    <img src={Report} alt="Report" className="icon report-icon" />
                </div>
            </div>


        </div>
    );
}


export default LandlordProfile;
