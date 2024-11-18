import React from 'react';
import './ReportReviewConfirmation.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg'
import MenuAlt from '../Assets/main-logo.svg';
import { useNavigate } from 'react-router-dom';

function ReportReviewConfirmation() {
    const navigate = useNavigate();

    const handleGoToMainPage = () => {
        navigate('/');
    };

    return (
        <div className="report-review-confirmation-main-container">
            <header>
                <div className="report-review-confirmation-logo-container">
                    <a href="/">
                        <img src={OfficialLogo} alt="Official Logo" className="report-review-confirmation-center-logo" />
                    </a>
                </div>

                {/* Background Image */}
                <img src={MenuAlt} alt="Menu" className="report-review-confirmation-background-image" />
                <img src={SubmitLandlordRate} alt="Submit Landlord Rate" className="report-landlord-left-icon" onClick={()=>navigate('/AddALandlord')}/>
                {/* Right Image: Account Button */}
                <a href="signin">
                    <img src={AccountButton} alt="Account Button" className="report-review-confirmation-right-icon" />
                </a>
            </header>

            <div className="report-review-confirmation-wrapper">
                <h1 className="report-review-title">Report a Review</h1>
                <p className="report-review-message">
                    Thank you for bringing this to our attention. We will thoroughly investigate the matter.
                </p>
                <button
                    onClick={handleGoToMainPage}
                    className="report-review-go-home-button"
                >
                    Go to main page
                </button>
            </div>

            
        </div>
    );
}

export default ReportReviewConfirmation;
