import React, { useState } from 'react';
import styles from './ResetPassword.module.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import NoAccountSideMenu from './NoAccountSideMenu';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
        <div className={styles['reset-password-main-container']}>
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                <img src={MenuAlt} alt="background" className={styles['reset-password-background-image']} />

            <div className={styles['reset-password-wrapper']}>
                <div className={styles['reset-password-form-box-login']}>
                    <h1 className={styles['reset-password-text']}>Reset Password</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles['reset-password-input-box']}>
                            <span className={styles['icon']}>
                                <input 
                                    type="email" 
                                    className={styles['reset-password-email-box']} 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label className={styles['reset-password-email-text']}>Email:</label>
                                </span>
                        </div>

                        {errorMessage && <div className={styles['reset-password-error']}>{errorMessage}</div>}
                        {successMessage && <div className={styles['reset-password-success']}>{successMessage}</div>}

                        <button type="submit" className={styles['reset-password-continue-button']}>Continue</button>

                        <div className={styles['reset-password-sign-in']}>
                            <h3 className={styles['small-sign-in-text-remember']}>Remembered your password?</h3>
                            <Link to="/SignIn" className={styles['sign-in-link-remember']}>Sign In</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
