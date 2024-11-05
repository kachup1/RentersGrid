import React, { useState } from 'react';
import './ReportReview.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import ReportButton from '../Assets/3-ppl-icon.svg';
import MenuAlt from '../Assets/main-logo.svg';
import NoAccountSideMenu from './NoAccountSideMenu';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';

function ReportReview() {
    const [selectedreview, setSelectedreview] = useState('');
    const [comments, setComments] = useState('');
    const [charCount, setCharCount] = useState(0);
    const navigate = useNavigate();

    const handlereviewChange = (e) => {
        setSelectedreview(e.target.value);
    };

    const handleCommentsChange = (e) => {
        setComments(e.target.value);
        setCharCount(e.target.value.length);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission 
        navigate('/ReportreviewConfirmation');
    };

    return (
        <div className="report-review-main-container">
            <NoAccountSideMenu />
            <header>
                <div className="report-review-logo-container">
                    <a href="/">
                        <img src={OfficialLogo} alt="Official Logo" className="report-review-center-logo" />
                    </a>
                </div>

                {/* Background Image */}
                <img src={MenuAlt} alt="Menu" className="report-review-background-image" />

                {/* Right Image: Account Button */}
                <a href="signin">
                    <img src={AccountButton} alt="Account Button" className="report-review-right-icon" />
                </a>
            </header>
            
            <div className="report-review-wrapper">
                <div className="report-review-form-box">
                    <div className="title-container">
                    <img src={ReportButton} alt="Report Button" className="report-review-icon" />
                    <h1 className="report-review-title">Report a review</h1>
                    </div>
                    <label htmlFor="review-select" className="report-review-label">*Why are you reporting?</label>
                    <select
                        id="review-select"
                        value={selectedreview}
                        onChange={handlereviewChange}
                        className="report-review-select"
                        required
                    >
                        <option value="">Select problem</option>
                        <option value="maintenance">Wrong Address</option>
                        <option value="noise">Wrong Name</option>
                        <option value="noise">Violent Speech</option>
                        <option value="noise">Harrassment</option>
                        <option value="noise">Bullying</option>
                        <option value="noise">Spam</option>
                        <option value="noise">False Information</option>
                        <option value="safety">Other</option>
                        {/* Add more options as needed */}
                    </select>
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
