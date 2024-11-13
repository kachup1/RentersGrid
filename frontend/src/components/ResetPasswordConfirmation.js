import React, { useState } from 'react';
import './ResetPasswordConfirmation.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import NoAccountSideMenu from './NoAccountSideMenu';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function ResetPasswordConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromReset = location.state?.email || ""; // Access the email from state, with a fallback

    // Event handler for "Go to main page" button
    const handleGoToMainPage = () => {
        navigate('/');  // Redirects to main page or adjust path if needed
    };

    return (
        <div className="reset-password-confirmation-main-container">
            <NoAccountSideMenu />
            <header>
                <div className="reset-password-confirmation-logo-container">
                    <a href="/">
                        <img src={OfficialLogo} alt="OfficialLogo" className="reset-password-confirmation-center-logo" />
                    </a>
                </div>

                {/* Background Image */}
                <img src={MenuAlt} alt="background" className="reset-password-confirmation-background-image" />

                {/* Left Image: Submit Landlord Rate */}
                <img src={SubmitLandlordRate} alt="Submit Landlord Rate" className="reset-password-confirmation-left-icon" />

                {/* Right Image: Account Button */}
                <a href="/signin">
                    <img src={AccountButton} alt="Account Button" className="reset-password-confirmation-right" />
                </a>
            </header>

            <div className="reset-password-confirmation-wrapper">
                <div className="reset-password-confirmation-form-box-login">
                    <h1 className="reset-password-confirmation-text">Reset Password</h1>
                    <p className="reset-password-confirmation-message-1">We've sent a password reset link to</p>
                    <p className="reset-password-confirmation-email">{emailFromReset}</p>
                    <p className="reset-password-confirmation-message-2">Please follow the instructions in the email to reset your password.</p>

                    {/* Button to navigate to main page */}
                    <button type="button" className="reset-password-confirmation-continue-button" onClick={handleGoToMainPage}>
                        Go to main page
                    </button>
                </div>
            </div>

            {/* Sign In link */}
            <div className="reset-password-confirmation-sign-in">
                <h3 className="small-reset-password-confirm-sign-in-text-remember">Remembered your password?</h3>
                <Link to="/SignIn" className="reset-password-confirm-link-remember">Sign In</Link>
            </div>
        </div>
    );
}

export default ResetPasswordConfirmation;
