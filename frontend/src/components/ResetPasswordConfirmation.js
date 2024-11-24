import React, { useState } from 'react';
import styles from './ResetPasswordConfirmation.module.css';
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
        <div className={styles['reset-password-confirmation-main-container']}>
            <NoAccountSideMenu />
            <header>
            <div className={styles['reset-password-confirmation-logo-container']}>
            <a href="/">
                        <img src={OfficialLogo} 
                        alt="OfficialLogo" 
                        className={styles['reset-password-confirmation-center-logo']} />
                        </a>
                </div>

                {/* Background Image */}
                <img 
                    src={MenuAlt} 
                    alt="background" 
                    className={styles['reset-password-confirmation-background-image']} 
                />
                {/* Left Image: Submit Landlord Rate */}
                <img 
                    src={SubmitLandlordRate} 
                    alt="Submit Landlord Rate" 
                    className={styles['reset-password-confirmation-left-icon']} 
                />
                {/* Right Image: Account Button */}
                <a href="/signin">
                <img 
                        src={AccountButton} 
                        alt="Account Button" 
                        className={styles['reset-password-confirmation-right']} 
                    />                </a>
            </header>
<div className={styles['reset-password-confirmation-wrapper']}>
                <div className={styles['reset-password-confirmation-form-box-login']}>
                    <h1 className={styles['reset-password-confirmation-text']}>Reset Password</h1>
                    <p className={styles['reset-password-confirmation-message-1']}>
                        We've sent a password reset link to
                    </p>
                    <p className={styles['reset-password-confirmation-email']}>{emailFromReset}</p>
                    <p className={styles['reset-password-confirmation-message-2']}>
                        Please follow the instructions in the email to reset your password.
                    </p>

                    {/* Button to navigate to main page */}
                    <button 
                        type="button" 
                        className={styles['reset-password-confirmation-continue-button']} 
                        onClick={handleGoToMainPage}
                    >
                        Go to main page
                    </button>
                </div>
            </div>

            {/* Sign In link */}
            <div className={styles['reset-password-confirmation-sign-in']}>
                <h3 className={styles['small-reset-password-confirm-sign-in-text-remember']}>
                    Remembered your password?
                </h3>
                <Link to="/SignIn" className={styles['reset-password-confirm-link-remember']}>
                    Sign In
                </Link>
            </div>
        </div>
    );
}

export default ResetPasswordConfirmation;
