import React, { useState } from 'react';
import './ResetPassword.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import NoAccountSideMenu from './NoAccountSideMenu';
import { Link, useNavigate } from 'react-router-dom';
import Helvetica from '../fonts/helvetica.woff';


function ResetPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Make API call to verify email
        try {
            const verifyResponse = await fetch('http://localhost:5000/VerifyEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const verifyData = await verifyResponse.json();


            if (!verifyResponse.ok) {
                setErrorMessage(verifyData.error);
                setSuccessMessage('');
                return;
            }

            const sendResponse = await fetch('http://localhost:5000/SendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const sendData = await sendResponse.json();

            if(sendResponse.ok) {
                setSuccessMessage('A reset password email has been sent!');
                setErrorMessage('');
            } else {
                setErrorMessage(sendData.error);
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="reset-password-main-container">
            <NoAccountSideMenu />
            <header>
                <div className="reset-password-logo-container">
                    <a href="/">
                        <img
                            src={OfficialLogo}
                            alt="OfficialLogo"
                            className="reset-password-center-logo"
                        />
                    </a>
                </div>

                {/* Background Image */}
                <img
                    src={MenuAlt}
                    alt="background"
                    className="reset-password-background-image"
                />

                {/* Left Image: Submit Landlord Rate */}
                <img
                    src={SubmitLandlordRate}
                    alt="Submit Landlord Rate"
                    className="reset-password-left-icon"
                />

                {/* Right Image: Account Button */}
                <a href="signin">
                    <img
                        src={AccountButton}
                        alt="Account Button"
                        className="reset-password-account-right"
                    />
                </a>
            </header>

            <div className="reset-password-wrapper">
                <div className="reset-password-form-box-login">
                    <h1 className='reset-password-text'>Reset Password</h1>
                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="reset-password-input-box">
                            <span className="icon">
                                <input 
                                    type="email" 
                                    className="reset-password-email-box" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} // Update state on change
                                />
                                <label className="reset-password-email-text">Email:</label>
                            </span>
                        </div>

                        {/* Error Message */}
                        {errorMessage && <div className="reset-password-error">{errorMessage}</div>}

                        {/* Submit Button */}
                        <button type="submit" className="reset-password-continue-button">Continue</button>

                        {/* Sign In */}
                        <div className="reset-password-sign-in">
                            <h3 className="small-sign-in-text-remember">Remembered your password?</h3>
                            <Link to="/SignIn" className="sign-in-link-remember">Sign In</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
