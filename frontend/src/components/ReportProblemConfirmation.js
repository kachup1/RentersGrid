import React from 'react';
import './ReportProblemConfirmation.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg'
import MenuAlt from '../Assets/main-logo.svg';
import { useNavigate } from 'react-router-dom';

function ReportProblemConfirmation() {
    const navigate = useNavigate();

    const handleGoToMainPage = () => {
        navigate('/');
    };

    return (
        <div className="report-problem-confirmation-main-container">
            <header>
                <div className="report-problem-confirmation-logo-container">
                    <a href="/">
                        <img src={OfficialLogo} alt="Official Logo" className="report-problem-confirmation-center-logo" />
                    </a>
                </div>

                {/* Background Image */}
                <img src={MenuAlt} alt="Menu" className="report-problem-confirmation-background-image" />
                <img src={SubmitLandlordRate} alt="Submit Landlord Rate" className="report-landlord-left-icon" onClick={()=>navigate('/AddALandlord')}/>
                {/* Right Image: Account Button */}
                <a href="signin">
                    <img src={AccountButton} alt="Account Button" className="report-problem-confirmation-right-icon" />
                </a>
            </header>

            <div className="report-problem-confirmation-wrapper">
                <h1 className="report-problem-title">Report a Problem</h1>
                <p className="report-problem-message">
                    Thank you for bringing this to our attention. We will thoroughly investigate the matter.
                </p>
                <button
                    onClick={handleGoToMainPage}
                    className="report-problem-go-home-button"
                >
                    Go to main page
                </button>
            </div>

            
        </div>
    );
}

export default ReportProblemConfirmation;
