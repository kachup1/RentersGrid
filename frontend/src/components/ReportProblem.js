import React, { useState, useEffect } from 'react';
import Header from './Header'
import styles from './ReportProblem.module.css';import AccountButton from '../Assets/Account button.svg';
import ReportButton from '../Assets/report-title.svg';
import MenuAlt from '../Assets/main-logo.svg';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { isTokenValid } from './authentication';


function ReportProblem() {  // landlordId is received as a prop
    const { landlordId } = useParams();
    const [selectedProblem, setSelectedProblem] = useState('');
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
    const handleProblemChange = (e) => {
        setSelectedProblem(e.target.value);
    };

    const handleCommentsChange = (e) => {
        setComments(e.target.value);
        setCharCount(e.target.value.length);
    };

    const [isReportValid, setIsReportValid] = useState(true);

    useEffect(() => {
        console.log("Received landlordId in ReportProblem:", landlordId); // Debugging
    }, [landlordId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProblem) {
            setIsReportValid(false); // Highlight the dropdown as invalid
            return;
        }
        setIsReportValid(true); // Reset validation state

        // Prepare the report data
        const reportData = {
            landlordId,
            comment: comments,
            category: selectedProblem,
            type: 'Problem',
        };

        try {
            const response = await fetch('http://localhost:5000/api/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData),
            });

            if (response.ok) {
                navigate('/ReportProblemConfirmation'); // Navigate to confirmation page on success
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
        <div className={styles[`report-problem-main-container`]}>
            {/* Background Image */}
            <img src={MenuAlt} alt="Menu" className={styles[`report-problem-background-image`]} />



            <div className={styles[`report-problem-wrapper`]}>
                <div className={styles[`report-problem-form-box`]}>
                    <div className={styles[`title-container`]}>
                        <img src={ReportButton} alt="Report Button" className={styles[`report-problem-icon`]} />
                        <h1 className={styles[`report-problem-title`]}>Report a Problem</h1>
                    </div>
                    <label htmlFor="problem-select" className={styles[`report-problem-label`]}>*Why are you reporting?</label>
                    <select
                        id="problem-select"
                        value={selectedProblem}
                        onChange={handleProblemChange}
                        className={`${styles[`report-problem-select`]} ${!isReportValid ? styles[`report-invalid-field`] : ''}`} // Apply "invalid-field" if invalid
                        required
                    >
                        <option value="">Select Problem</option>
                        <option value="Wrong Landlord Name">Wrong Landlord Name</option>
                        <option value="Wrong Review under Landlord">Wrong Review under Landlord</option>
                        <option value="Other">Other</option>
                    </select>
                    {!isReportValid && <span className={styles[`report-error-message`]}>This field is required.</span>}

                    <label htmlFor="comments" className={styles[`report-problem-comments-label`]}>Additional comments:</label>
                    <div className={styles[`char-count`]}>{charCount} / 500</div>
                    <textarea
                        id="comments"
                        placeholder="  Please provide details about the problem."
                        maxLength="500"
                        value={comments}
                        onChange={handleCommentsChange}
                        className={styles[`report-problem-textarea`]}
                    ></textarea>

                    <button type="submit" className={styles[`report-problem-submit-button`]} onClick={handleSubmit}>
                        Submit Report
                    </button>
                </div>
            </div>


        </div>
        </div>
    );
}

export default ReportProblem;
