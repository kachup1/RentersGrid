import React, { useState, useEffect} from 'react';
import './ReportReview.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import ReportButton from '../Assets/report-title.svg';
import MenuAlt from '../Assets/main-logo.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg'
import SideMenu from './SideMenu';  // Import the logged-in side menu
import NoAccountSideMenu from './NoAccountSideMenu'; 
import { Link, useParams, useNavigate } from 'react-router-dom';
import { isTokenValid } from './authentication';

function ReportReview() {
    const { landlordId, ratingId } = useParams();
    const [selectedreview, setSelectedreview] = useState('');
    const [comments, setComments] = useState('');
    const [charCount, setCharCount] = useState(0);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    setIsLoggedIn(isTokenValid());
  }, []);
    const handlereviewChange = (e) => {
        setSelectedreview(e.target.value);
    };

    const handleCommentsChange = (e) => {
        setComments(e.target.value);
        setCharCount(e.target.value.length);
    };

    const [isReviewValid, setIsReviewValid] = useState(true);

    useEffect(() => {
        console.log("Received landlordId in ReportReview:", landlordId); // Debugging
        console.log("Received ratingId in ReportReview:", ratingId); // Debugging
    }, [landlordId, ratingId]);
   
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!selectedreview) {
            setIsReviewValid(false);
            return;
        } else {
            setIsReviewValid(true);
        }
    
        // Proceed with the form submission
        const reportData = {
            landlordId,
            ratingId,
            comment: comments,
            category: selectedreview,
            type: 'Review',
        };
    
        try {
            const response = await fetch('http://localhost:5000/api/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData),
            });
    
            if (response.ok) {
                navigate('/ReportReviewConfirmation');
            } else {
                console.error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    };
    
    return (
        <div className="report-review-main-container">
            {isLoggedIn ? <SideMenu /> : <NoAccountSideMenu />}
            <header>
                <div className="report-review-logo-container">
                    <a href="/">
                        <img src={OfficialLogo} alt="Official Logo" className="report-review-center-logo" />
                    </a>
                </div>

                {/* Background Image */}
                <img src={MenuAlt} alt="Menu" className="report-review-background-image" />
                <img src={SubmitLandlordRate} alt="Submit Landlord Rate" className="report-landlord-left-icon" onClick={()=>navigate('/AddALandlord')}/>
                {/* Right Image: Account Button */}
                <img
                        src={AccountButton}
                        alt="Account Button"
                        className="report-review-right-icon" // Adjusted class name
                        onClick={() =>{ 
                            if (isTokenValid()) {
                            navigate('/myaccount');  // Navigate to "My Account" if logged in
                          } else {
                            navigate('/signin');  // Navigate to "Sign In" if not logged in
                          }
                        }} // Directly use navigate in the onClick
                    />
            </header>
            
            <div className="report-review-wrapper">
                <div className="report-review-form-box">
                    <div className="title-container">
                    <img src={ReportButton} alt="Report Button" className="report-review-icon" />
                    <h1 className="report-review-title">Report a Review</h1>
                    </div>
                    <label htmlFor="review-select" className="report-review-label">*Why are you reporting?</label>
                    <select
                        id="review-select"
                        value={selectedreview}
                        onChange={handlereviewChange}
                        className={`report-review-select ${!isReviewValid ? 'report-review-invalid-field' : ''}`}
                        required
                    >
                        <option value="">Select problem</option>
                        <option value="maintenance">Wrong Address</option>
                        <option value="wrong-name">Wrong Name</option>
                        <option value="harrassment">Harrassment</option>
                        <option value="spam">Spam</option>
                        <option value="false-information">False Information</option>
                        <option value="safety">Other</option>
                    </select>
                    {!isReviewValid && <span className="rp-review-error-message">This field is required.</span>}

                    <label htmlFor="comments" className="report-review-comments-label">Additional comments:</label>
                    <div className="char-count">{charCount} / 500</div>
                    <textarea
                        id="comments"
                        placeholder="  Please provide details about the problem on this review."
                        maxLength="500"
                        value={comments}
                        onChange={handleCommentsChange}
                        className="report-review-textarea"
                    ></textarea>

                    <button type="submit" className="report-review-submit-button" onClick={handleSubmit}>
                        Submit Report
                    </button>
                </div>
            </div>

            { /* POSSIBLE SUPPORT ??
             <div className="report-review-sign-in">
                <h3 className="report-review-sign-in-text">Need more help?</h3>
                <Link to="/Support" className="report-review-support-link">Contact Support</Link>
            </div> */}
        </div>
    );
}

export default ReportReview;
