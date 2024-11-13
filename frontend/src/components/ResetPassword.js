import React, { useState } from 'react';
import './ResetPassword.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import NoAccountSideMenu from './NoAccountSideMenu';
import { Link, useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // First, verify if the email exists
            const verifyResponse = await fetch('http://localhost:5000/VerifyEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
    
            const verifyData = await verifyResponse.json();
    
            if (verifyResponse.ok) {
                // If email exists, proceed to send the reset email
                const response = await fetch('http://localhost:5000/api/password-reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    setSuccessMessage('A reset password email has been sent!');
                    setErrorMessage('');
                    // Navigate to a confirmation page
                    navigate('/ResetPasswordConfirmation', { state: { email } });
                } else {
                    setErrorMessage(data.error);
                    setSuccessMessage('');
                }
            } else {
                // If email does not exist, show an error message
                setErrorMessage(verifyData.error);
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            setSuccessMessage('');
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

                <img src={MenuAlt} alt="background" className="reset-password-background-image" />
                <a href="addalandlord">
                    <img
                        src={SubmitLandlordRate}
                        alt="Submit Landlord Rate"
                        className="sign-in-left-icon"
                    />
                </a>
                <a href="signin">
                    <img src={AccountButton} alt="Account Button" className="reset-password-account-right" />
                </a>
            </header>

            <div className="reset-password-wrapper">
                <div className="reset-password-form-box-login">
                    <h1 className='reset-password-text'>Reset Password</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="reset-password-input-box">
                            <span className="icon">
                                <input 
                                    type="email" 
                                    className="reset-password-email-box" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label className="reset-password-email-text">Email:</label>
                            </span>
                        </div>

                        {errorMessage && <div className="reset-password-error">{errorMessage}</div>}
                        {successMessage && <div className="reset-password-success">{successMessage}</div>}

                        <button type="submit" className="reset-password-continue-button">Continue</button>

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
