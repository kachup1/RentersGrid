import React, { useState, useEffect} from 'react';
import styles from './ReportReview.module.css';
import Header from './Header.js'
import ReportButton from '../Assets/report-title.svg';
import MenuAlt from '../Assets/main-logo.svg';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { isTokenValid } from './authentication';

function ReportReview() {
    const { landlordId, ratingId } = useParams();
    const [selectedreview, setSelectedreview] = useState('');
    const [comments, setComments] = useState('');
    const [charCount, setCharCount] = useState(0);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
        <div className={styles[`parent`]}>
            <div className="Header">
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
        <div className="report-review-main-container">
            
                <div className={styles[`report-review-logo-container`]}>
                   

                {/* Background Image */}
                <img src={MenuAlt} alt="Menu" className={styles[`report-review-background-image`]} />
                
            
            <div className={styles[`report-review-wrapper`]}>
                <div className={styles[`report-review-form-box`]}>
                    <div className={styles[`title-container`]}>
                    <img src={ReportButton} alt="Report Button" className={styles[`report-review-icon`]} />
                    <h1 className={styles[`report-review-title`]}>Report a Review</h1>
                    </div>
                    <label htmlFor="review-select" className={styles[`report-review-label`]}>*Why are you reporting?</label>
                    <select
                        id="review-select"
                        value={selectedreview}
                        onChange={handlereviewChange}
                        className={`${styles[`report-review-select`]} ${!isReviewValid ? styles[`report-invalid-field`] : ''}`} // Apply "invalid-field" if invalid
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
                    {!isReviewValid && <span className={styles[`rp-review-error-message`]}>This field is required.</span>}

                    <label htmlFor="comments" className={styles[`report-review-comments-label`]}>Additional comments:</label>
                    <div className={styles[`char-count`]}>{charCount} / 500</div>
                    <textarea
                        id="comments"
                        placeholder="Please provide details about the problem on this review."
                        maxLength="500"
                        value={comments}
                        onChange={handleCommentsChange}
                        className={styles[`report-review-textarea`]}
                    />

                    <button type="submit" className={styles[`report-review-submit-button`]} onClick={handleSubmit}>
                        Submit Report
                    </button>
                </div>
            </div>
            </div>
            </div>
        </div>
    );
}

export default ReportReview;
