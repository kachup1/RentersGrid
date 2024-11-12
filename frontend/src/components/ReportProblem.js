import React, { useState, useEffect } from 'react';
import './ReportProblem.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import ReportButton from '../Assets/report-title.svg';
import MenuAlt from '../Assets/main-logo.svg';
import NoAccountSideMenu from './NoAccountSideMenu';
import SideMenu from './SideMenu';  // Import the logged-in side menu
import { Link, useParams, useNavigate } from 'react-router-dom';
import { isTokenValid } from './authentication';


function ReportProblem() {  // landlordId is received as a prop
    const { landlordId } = useParams();
    const [selectedProblem, setSelectedProblem] = useState('');
    const [comments, setComments] = useState('');
    const [charCount, setCharCount] = useState(0);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    

  useEffect(() => {
    // Check if the user is logged in
    setIsLoggedIn(isTokenValid());
  }, []);
    const handleProblemChange = (e) => {
        setSelectedProblem(e.target.value);
    };

    const handleCommentsChange = (e) => {
        setComments(e.target.value);
        setCharCount(e.target.value.length);
    };
    useEffect(() => {
        console.log("Received landlordId in ReportProblem:", landlordId); // Debugging
    }, [landlordId]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the report data to send to the backend
        const reportData = {
            landlordId,
            comment: comments,
            category: selectedProblem,
            type: 'Problem', 
        };

        try {
            // Send POST request to the backend
            const response = await fetch('http://localhost:5000/api/report', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData),
            });

            if (response.ok) {
                navigate('/ReportProblemConfirmation');  // Navigate to confirmation page on success
            } else {
                console.error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    };

    return (
        <div className="report-problem-main-container">
            {isLoggedIn ? <SideMenu /> : <NoAccountSideMenu />}
            <header>
                <div className="report-problem-logo-container">
                    <a href="/">
                        <img src={OfficialLogo} alt="Official Logo" className="report-problem-center-logo" />
                    </a>
                </div>

                {/* Background Image */}
                <img src={MenuAlt} alt="Menu" className="report-problem-background-image" />

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
                        <option value="Wrong Landlord Name">Wrong Landlord Name</option>
                        <option value="Wrong Review under Landlord">Wrong Review under Landlord</option>
                        <option value="Other">Other</option>
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

            
        </div>
    );
}

export default ReportProblem;
