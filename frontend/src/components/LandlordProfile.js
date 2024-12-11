
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import LandlordIcon from '../Assets/landlord-title-logo.svg';
import Bookmark from '../Assets/fav-unselect.svg';
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
import axios from 'axios';
import styles from './LandlordProfile.module.css';
import { isTokenValid } from './authentication';

import Header from './Header';

function LandlordProfile() {
    const { landlordId , ratingId} = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [bookmarked, setBookmarked] = useState({});
    const [landlordData, setLandlordData] = useState({properties:[],reviews:[]});
    const [isThumbsUpSelected, setIsThumbsUpSelected] = useState(false);
    const [isThumbsDownSelected, setIsThumbsDownSelected] = useState(false);
    const [selectedPropertyId,setSelectedPropertyId] = useState('all');
    const[sortOrder, setSortOrder] = useState("mostRecent");
    /*For the new header: */
     // State for side menu if it's open
     const [isMenuOpen, setIsMenuOpen] = useState(false);

     // Function to toggle the menu
     const toggleMenu = () => {
         setIsMenuOpen(!isMenuOpen);
     };
    const navigate = useNavigate();

    // Check if properties data is available before attempting to access it
    const property = landlordData.properties.find(
        (prop) => prop.propertyId === selectedPropertyId
    );
    
    const propertyLocation =
        selectedPropertyId === "all"
            ? "All Properties"
            : property
            ? `${property.propertyname} at ${property.address}, ${property.city}, ${property.state}`
            : "Location not available";
    

    useEffect(() => {
        fetch(`/api/landlord/${landlordId}`)
            .then(response => response.json())
            .then(data => setLandlordData(data))    
            .catch(error => console.error(error));
    }, [landlordId]);

    const handlePropertyChange = (event) => {
        /*const value = event.target.value;*/
       setSelectedPropertyId(event.target.value === "all"?"all":parseInt(event.target.value,10));
    };

    const handleSortChange = (event)=>{
        setSortOrder(event.target.value);
    }

    /* Applying both sort property and options to reviews */
const filteredAndSortedReviews = landlordData.reviews
? landlordData.reviews
    .filter(review => selectedPropertyId === "all" || review.propertyId === selectedPropertyId)
    .map(review => {
      // Find the corresponding property for the current review
      const reviewProperty = landlordData.properties.find(
        property => property.propertyId === review.propertyId
      );

      // Attach the property details to the review
      return {
        ...review,
        propertyDetails: reviewProperty || {
          propertyname: "Unknown Property",
          address: "Address not available",
          city: "",
          state: "",
          zipcode: "",
        },
      };
    })
    .sort((a, b) => {
      if (sortOrder === "highestRating") {
        return b.score - a.score;
      } else if (sortOrder === "lowestRating") {
        return a.score - b.score;
      } else {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
    })
: [];


  

    console.log("Selected Property ID:", selectedPropertyId); // Debugging line
    console.log("Filtered and Sorted Reviews:", filteredAndSortedReviews);


    useEffect(() => {
        if (isTokenValid()) {
            setIsLoggedIn(true);
            const token = localStorage.getItem('token');
            fetchBookmarks(token);
        }else {
            setIsLoggedIn(false);
          }
    }, []);
    
    useEffect(() => {
        const scrollToReview = () => {
            const hash = window.location.hash; // Get URL hash
            if (hash) {
                const reviewId = hash.replace("#review-", ""); // Extract the ratingId from hash
                const reviewElement = document.getElementById(`review-${reviewId}`);
                
                if (reviewElement) {
                    reviewElement.scrollIntoView({ behavior: "smooth", block: "center" }); // Smooth scroll
                    reviewElement.classList.add("highlight"); // Add highlight class
                    
                    // Remove the highlight after a delay (e.g., 2 seconds)
                    setTimeout(() => {
                        reviewElement.classList.remove("highlight");
                    }, 2000);
                }
            }
        };
    
        // Only run scrollToReview if reviews have loaded
        if (landlordData.reviews && landlordData.reviews.length > 0) {
            scrollToReview();
        }
    
        // Listen for hash changes (e.g., if user navigates to another review link on the same page)
        window.addEventListener("hashchange", scrollToReview);
    
        // Clean up the event listener on component unmount
        return () => window.removeEventListener("hashchange", scrollToReview);
    }, [landlordData.reviews]); // Depend on reviews loading

     // Function to fetch bookmarks when the user logs in
  const fetchBookmarks = (token) => {
    fetch('http://localhost:5000/api/bookmarks', {
      headers: {
        'Authorization': `Bearer ${token}`  // Sends JWT token for authentication
      }
    })
      .then(response => response.json())
      .then(bookmarkedLandlords => {
        const updatedBookmarked = {};
        bookmarkedLandlords.forEach(landlordId => {
          updatedBookmarked[landlordId] = true;
        });
        setBookmarked(updatedBookmarked);
      })
      .catch(error => {
        console.error('Error fetching bookmarks:', error);
      });
  };
    
    const toggleBookmark = (landlordId) => {
        if (!isLoggedIn) {
            alert('Please log in to bookmark landlords.');
            navigate('/SignIn');
            return;
        }

        const isBookmarked = bookmarked[landlordId];
        setBookmarked((prevBookmarked) => ({
            ...prevBookmarked,
            [landlordId]: !prevBookmarked[landlordId],
          }));

          const token = localStorage.getItem('token');
          const method = isBookmarked ? 'DELETE' : 'POST';

    fetch('http://localhost:5000/api/bookmark', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ landlordId }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.message) {
            console.log(data.message);
          }
        })
        .catch(error => {
          console.error(`Error ${isBookmarked ? 'removing' : 'adding'} bookmark:`, error);
        });
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

    //for share button
    const handleShareClick = (landlordId, ratingId) => {
        const shareUrl = `${window.location.origin}/LandlordProfile/${landlordId}/#review-${ratingId}`; // URL with hash anchor to review
    
        if (navigator.share) {
            navigator.share({
                title: "Check out this review on RentersGrid!",
                url: shareUrl,
            })
            .then(() => console.log("Successful share"))
            .catch((error) => console.error("Error sharing", error));
        } else {
            // Fallback: copy link to clipboard if navigator.share is not supported
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert("Link copied to clipboard!");
            });
        }
    };
    
    const handleReportReviewClick = (ratingId) => {
        if (!ratingId) {
            console.error("ratingId is missing.");
            return;
        }
        navigate(`/ReportReview/${landlordId}/${ratingId}`); // Navigate to report review page with landlordId and ratingId
    };
    

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



//VOTING helpfull thumbs up or down------------------------------------------------
const [reviewVotes, setReviewVotes] = useState({});
const [userVotes, setUserVotes] = useState({});


useEffect(() => {
    fetch(`/api/landlord/${landlordId}`)
        .then(response => response.json())
        .then(data => {
            setLandlordData(data);

            // Set initial votes based on data from the database
            const initialVotes = data.reviews.reduce((acc, review) => {
                acc[review.ratingId] = {
                    helpful: review.helpful, // set to the actual helpful count
                    notHelpful: review.notHelpful // set to the actual notHelpful count
                };
                return acc;
            }, {});
            setReviewVotes(initialVotes);  // Set initial vote counts
        })
        .catch(error => console.error(error));
}, [landlordId]);


// Function to handle voting, allowing only one vote per session, with the ability to undo
const handleVote = (reviewId, type) => {
    const currentVote = userVotes[reviewId];  // Retrieve current vote state for this review

    // Determine if the user is removing their vote or changing it
    const isRemovingVote = currentVote === type;
    const action = isRemovingVote ? 'remove' : 'add';

    // If they're trying to vote on the other option, ignore the request
    if (currentVote && !isRemovingVote) return;

    axios.post(`http://localhost:5000/api/review/${reviewId}/vote`, {
        type,  // "helpful" or "notHelpful"
        action // "add" or "remove"
    })
    .then(response => {
        const data = response.data;
        if (data.success) {
            // Update vote counts based on response
            setReviewVotes(prevVotes => ({
                ...prevVotes,
                [reviewId]: {
                    helpful: data.new_helpful_count,
                    notHelpful: data.new_notHelpful_count
                }
            }));

            // Update the user's vote status for this review in the session
            setUserVotes(prevVotes => ({
                ...prevVotes,
                [reviewId]: isRemovingVote ? null : type  // Remove vote if undoing, otherwise set the vote type
            }));
        } else {
            console.error("Error:", data.error);
        }
    })
    .catch(error => console.error("Error in voting:", error));
};

const formatLandlordName = (name) => {
    if (!name) return '';

    const [firstName, lastName] = name.split(' ');

    // Case: If either name exceeds 10 characters
    if ((firstName?.length > 10 || lastName?.length > 10) && firstName && lastName) {
        // Case: If either name exceeds 15 characters, make the font smaller
        if (firstName.length > 15 || lastName.length > 15) {
            return (
                <div className={styles["small-font"]}>
                    <span>{firstName}</span>
                    <br />
                    <span>{lastName}</span>
                </div>
            );
        }
        return (
            <>
                <span>{firstName}</span>
                <br />
                <span>{lastName}</span>
            </>
        );
    }
    // Default: Display in a single line
    return `${firstName || ''} ${lastName || ''}`;
};



    return (
        <div className={styles["landlord-profile-container"]}>
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />


            {/* Landlord Information Section */}
            <div className={styles["landlord-info"]}>
                <img src={LandlordIcon} alt="Landlord Icon" className={styles["middle-icon"]} />

                <div className={styles["landlord-information"]}>
                    <div className={styles["landlord-details"]}>
                        <div className={styles["rating-box"]}>
                            <p className={styles["landlord-rates"]}>{landlordData.averageRating ? landlordData.averageRating.toFixed(1):"N/A"}</p>
                        </div>
                        <div>

                        <div className={styles["landlord-name-container"]}>
                        <h2 className={styles["landlord-name"]}>
                            {formatLandlordName(landlordData.name)}
                        </h2>

                        </div>

                            <p className={styles["landlord-location"]}>{propertyLocation}</p>
                        </div>
                        <div className={styles["landlord-bookmark-icon"]} onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(landlordData.landlordId);
                        }}>
                            <img src={bookmarked[landlordData.landlordId] ? SelectedBookmark : Bookmark} alt="Bookmark Icon" className={styles["bookmark-icon-img"]} />
                        </div>
                        <div className={styles['landlord-report-icon']}>
                            <img
                        src={Report}
                        alt="Report"
                        className={styles["report-icon-img"]}
                        onClick={handleReportClick} // Add click event to navigate
                            />
                        </div>
                        
                    </div>

                    <div className={styles["button-container"]}>
                    <button className={styles["green-button"]} onClick={handleAddReviewClick}>
                        <span className={styles["svg-wrapper"]}>
                            <img src={GreenButton} alt="Add Review" />
                        </span>
                        <span className={styles["green-text"]}>Add a Review</span>
                    </button>

                        <button className={styles["red-button"]} onClick={handleAddPropertyClick}>
                            <img src={RedButton} alt="Add a Property" />
                            <span className={styles["red-text"]}>Add a Property</span>
                        </button>
                    </div>

                </div>

                {/* Rating Summary */}
                <div className={styles["rating-summary"]}>
                {[
                    { label: "Excellent", icon: ExcellentFace, count: ratingDistribution.Excellent || 0, colorClass: "green-bar" },
                    { label: "Good", icon: GoodFace, count: ratingDistribution.Good || 0, colorClass: "green-bar" },
                    { label: "Average", icon: AverageFace, count: ratingDistribution.Average || 0, colorClass: "yellow-bar" },
                    { label: "Decent", icon: DecentFace, count: ratingDistribution.Decent || 0, colorClass: "orange-bar" },
                    { label: "Poor", icon: PoorFace, count: ratingDistribution.Poor || 0, colorClass: "red-bar" },
                ].map((rating) => (
                    <div className={styles["rating-item"]} key={rating.label}>
                        <img src={rating.icon} alt={rating.label} className={styles["rating-face"]} />
                        <span className={styles["rating-label"]}>{rating.label}</span>
                        <div className={styles["rating-bar"]}>
                            <div className={styles[rating.colorClass]} style={{ width: `${getBarWidth(rating.count)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
                
            </div>
            {/* Dropdowns for Select Property and Sort By */}
            <div className={styles["dropdown-container"]}>
                <div className={styles["dropdown"]}>
                    <label htmlFor="propertySelect">Select Property: </label>
                    <select id="propertySelect" name="propertySelect" onChange={handlePropertyChange}>
                        <option value="all">All Properties</option>
                    {
                    landlordData.properties.map((property) => (
                        <option key={property.propertyId} value={property.propertyId}>
                            {property.propertyname}
                        </option>
                            )
                        )}
                        {/* Add more options as needed */}
                    </select>
                </div>

                <div className={styles["dropdown"]}>
                    <label htmlFor="sortSelect">Sort By: </label>
                    <select id="sortSelect" name="sortSelect" onChange={handleSortChange}>
                        <option value="mostRecent">Most Recent</option>
                        <option value="highestRating">Highest Rating</option>
                        <option value="lowestRating">Lowest Rating</option>
                        {/* Add more sorting options as needed */}
                    </select>
                </div>
            </div>
            <div className={styles["reviews-and-icons"]}>
                {/* Reviews Section */}
                <div className={styles["landlord-reviews-section"]}>
                    <div className={styles["reviews-header-and-card"]}>

                        {/* Total Reviews Text */}
                        
                            <h1>Total Reviews: {filteredAndSortedReviews.length}</h1>
                            {filteredAndSortedReviews.length === 0 ? (
            <div className={styles["no-reviews"]}>
                <p>Be the first to rate!</p>
                <button
                    className={styles["add-review-button"]}
                    onClick={handleAddReviewClick}
                >
                    <div className={styles["button-content"]}>
                        <img
                            src={GreenButton}
                            alt="Green Button"
                            className={styles["green-button-icon"]}
                        />
                        <span className={styles["button-text"]}>Add a Review</span>
                    </div>
                </button>

            </div>
        ) : (filteredAndSortedReviews.map(review=>(

                        
                        <div 
                                id={`review-${review.ratingId}`}  //for share function
                                key ={review.ratingId} 
                                className={styles["review-card"]}>
                            {/* Left Column containing the score and review details */}
                            <div className={styles["left-column"]}>
                                <div className={styles["review-rating"]}>

                                <div className={`${styles["score-text"]} ${styles[`score-${review.score}`]}`}>
                                    <span className={styles["score-number"]}>{review.score}</span>
                                </div>
                                
                                <p className={styles['landlord-five-score']}>/5</p>
                                </div>
                                <div className={styles["review-details"]}>
                                    <div className={styles[review.maintenance === "Yes"?"green":review.maintenance==="No"?"red":"gray"]}>Timely Maintenance</div>
                                    <div className={styles[review.pets === "Yes"?"green":review.pets==="No"?"red":"gray"]}>Allows Pets</div>
                                    <div className={styles[review.safety==="Yes"?"green":review.safety ==="No"?"red":"gray"]}>Safe Area</div>
                                    <div className={styles[review.raisemoney === "Yes"?"green":review.raisemoney==="No"?"red":"gray"]}>Fair Rent increases</div>
                                    <div className={styles[review.reachable === "Yes"? "green":review.reachable==="No"?"red":"gray"]}>Reachable</div>
                                    <div className={styles[review.clearcontract === "Yes"?"green":review.clearcontract==="No"?"red":"gray"]}>Clear & Fair Contract</div>
                                </div>
                            </div>
                            {/* Right Column containing the comment section */}
                            <div className={styles["comment-container"]}>
                                <div className={styles["comment-header"]}>
                                    <div className={styles["address-container"]}>

                                <h2>{review.propertyDetails.propertyname}</h2>
                                    <p>{review.propertyDetails.address}</p>
                                    <p>{review.propertyDetails.city}, {review.propertyDetails.state} {review.propertyDetails.zipcode}</p>
                                    
                                    </div>

                                    <div className={styles["helpful-container"]}>
                                        <span>Helpful:</span>
                                        <img
                                            src={reviewVotes[review.ratingId]?.helpful ? GreenThumbsUp : GreyThumbsUp}
                                            alt="Thumbs Up"
                                            className={styles["thumb-icon"]}
                                            onClick={() => handleVote(Number(review.ratingId), 'helpful', 'add')}
                                            />
                                            <span>{reviewVotes[review.ratingId]?.helpful || 0}</span>

                                        <img
                                            src={reviewVotes[review.ratingId]?.notHelpful ? RedThumbsDown : GreyThumbsDown}
                                            alt="Thumbs Down"
                                            className={styles["thumb-icon"]}
                                            onClick={() => handleVote(Number(review.ratingId), 'notHelpful', 'add')}
                                            />
                                            <span>{reviewVotes[review.ratingId]?.notHelpful || 0}</span>

                                    </div>
                                </div>

                                <div className={styles["review-text"]}>
                                    <p>{review.comment}</p>
                                </div>

                                <div className={styles["recommend-container"]}>
                                    <p>Recommend:</p>
                                    {review.recommend === "No Response"?(
                                        <span className={styles["black"]}>No Response</span>
                                    ):(
                                        <>
                                    <button
                                        className={`${styles["recommend-button"]} ${
                                            review.recommend === "Yes" ? styles["selected"] : ""
                                        }`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className={`${styles["recommend-button"]} ${
                                            review.recommend === "No" ? styles["selected"] : ""
                                        }`}
                                    >
                                        No
                                        </button>
                                                </>
                                        
                                    )}
                                    
                                </div>

                                <span className={styles["review-date"]}>
                                    {new Date(review.timestamp).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>


                                {/* Icons Container for Share and Report */}
                                <div className={styles["icons-container"]}>
                                    <img src={Share} alt="Share" className={styles["icon share-icon"]} onClick={() => handleShareClick(landlordId, review.ratingId)}/>
                                    <img src={Report} alt="Report" className={styles["icon report-icon"]} onClick={() => handleReportReviewClick(review.ratingId)}/>
                                    
                                </div>
                     
                            </div>
                                 
                        </div>
                        
                         ))
                        )}
                    </div>
               
                </div>
           
                  

                
            </div>
           


        </div>
    );
}


export default LandlordProfile;