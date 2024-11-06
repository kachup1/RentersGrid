import React, { useState } from 'react';
import './ReportProblem.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import ReportButton from '../Assets/report-title.svg';
import MenuAlt from '../Assets/main-logo.svg';
import NoAccountSideMenu from './NoAccountSideMenu';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';

function ReportProblem() {
    const [selectedProblem, setSelectedProblem] = useState('');
    const [comments, setComments] = useState('');
    const [charCount, setCharCount] = useState(0);
    const navigate = useNavigate();

    const handleProblemChange = (e) => {
        setSelectedProblem(e.target.value);
    };

    const handleCommentsChange = (e) => {
        setComments(e.target.value);
        setCharCount(e.target.value.length);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission 
        navigate('/ReportProblemConfirmation');
    };

    return (
        <div className="report-problem-main-container">
            <NoAccountSideMenu />
            <header>
                <div className="report-problem-logo-container">
                    <a href="/">
                        <img src={OfficialLogo} alt="Official Logo" className="report-problem-center-logo" />
                    </a>
                </div>

                {/* Background Image */}
                <img src={MenuAlt} alt="Menu" className="report-problem-background-image" />

                {/* Right Image: Account Button */}
                <a href="signin">
                    <img src={AccountButton} alt="Account Button" className="report-problem-right-icon" />
                </a>
            </header>
            
            <div className="report-problem-wrapper">
                <div className="report-problem-form-box">
                    <div className="title-container">
                    <img src={ReportButton} alt="Report Button" className="report-problem-icon" />
                    <h1 className="report-problem-title">Report a Problem</h1>
                    </div>
                    <label htmlFor="problem-select" className="report-problem-label">*Why are you reporting?</label>
                    <select
                        id="problem-select"
                        value={selectedProblem}
                        onChange={handleProblemChange}
                        className="report-problem-select"
                        required
                    >
                        <option value="">Select Problem</option>
                        <option value="maintenance">Wrong Landlord name</option>
                        <option value="noise">Wrong Review under Landlord</option>
                        <option value="safety">Other</option>
                        {/* Add more options as needed */}
                    </select>
                    <label htmlFor="comments" className="report-problem-comments-label">Additional comments:</label>
                    <div className="char-count">{charCount} / 500</div>
                    <textarea
                        id="comments"
                        placeholder="  Please provide details about the problem."
                        maxLength="500"
                        value={comments}
                        onChange={handleCommentsChange}
                        className="report-problem-textarea"
                    ></textarea>

                    <button type="submit" className="report-problem-submit-button" onClick={handleSubmit}>
                        Submit Report
                    </button>
                </div>
            </div>

            { /* POSSIBLE SUPPORT ??
             <div className="report-problem-sign-in">
                <h3 className="report-problem-sign-in-text">Need more help?</h3>
                <Link to="/Support" className="report-problem-support-link">Contact Support</Link>
            </div> */}
        </div>
    );
}

export default ReportProblem;
