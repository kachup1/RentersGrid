import React, { useState } from 'react'; // Import useState
import styles from './SignIn.module.css'; 
import OfficialLogo from '../Assets/official logo.svg'; 
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NoAccountSideMenu from './NoAccountSideMenu';
import axios from 'axios'; // Import axios for making API requests

function SignIn() {
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(''); // State for error messages
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const navigate = useNavigate(); // Initialize useNavigate for redirection

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        setError(''); // Reset any previous error messages
        setSuccessMessage(''); // Reset success message

        try {
            // Make a POST request to the login API
            const response = await axios.post('http://localhost:5000/Login', {
                email: email,
                password: password,
            });
            
            // Handle successful login
            const { access_token } = response.data; // Extract the access token from the response
            localStorage.setItem('token', access_token); // Store the token in localStorage

            // Set success message
            setSuccessMessage('Login successful! Welcome!');

            navigate('/');

        } catch (err) {
            console.error(err); // Log the full error object
            setError(err.response?.data?.error || 'An error occurred.'); // Set the error message if login fails
        }
    };

    return (
        <div className={styles['sign-in-main-container']}>  
            <NoAccountSideMenu />
            <header>
                {/* Home Page + logo */}
                <div className={styles['sign-in-logo-container']}>
                    <a href="/">
                        <img
                            src={OfficialLogo}
                            alt="Official Logo"
                            className={styles['sign-in-center-logo']}
                        />
                    </a>
                </div>

                {/* Background Image */}
                <img
                    src={MenuAlt}
                    alt="background"
                    className={styles['sign-in-background-image']}
                />

                {/* Left Image: Submit Landlord Rate */}
                <a href="addalandlord">
                    <img
                        src={SubmitLandlordRate}
                        alt="Submit Landlord Rate"
                        className={styles['sign-in-left-icon']}
                    />
                </a>

                {/* Right Image: Account Button */}
                <a href="SignIn">
                    <img
                        src={AccountButton}
                        alt="Account Button"
                        className={styles['sign-in-account-right']}
                    />
                </a>
            </header>

            <div className={styles['sign-in-wrapper']}>
                <div className={styles['sign-in-form-box-login']}>
                    <h1 className={styles['sign-in-text']}>Sign In</h1>
                    <form onSubmit={handleSubmit}> {/* Call handleSubmit on form submission */}
                        {/* Email */}
                        <div className={styles['sign-in-input-box']}>
                            <span className={styles['icon']}>
                                <input
                                    type="email"
                                    className={styles['sign-in-email-box']}
                                    required
                                    value={email} // Bind email state to input
                                    onChange={(e) => setEmail(e.target.value)} // Update email state on change
                                />
                                <label className={styles['sign-in-email-text']}>Email:</label>
                            </span>
                        </div>

                        {/* Password */}
                        <div className={styles['sign-in-input-box']}>
                            <span className={styles['icon']}>
                                <input
                                    type="password"
                                    className={styles['sign-in-password-box']}
                                    required
                                    value={password} // Bind password state to input
                                    onChange={(e) => setPassword(e.target.value)} // Update password state on change
                                />
                                <label className={styles['sign-in-password-text']}>Password:</label>
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className={styles['sign-in-submit-button']}>Sign In</button>

                        {/* Error Message */}
                        {error && <p className={styles['sign-in-error-message']}>{error}</p>} {/* Display error message if any */}

                        {/* Success Message */}
                        {successMessage && <p className={styles['sign-in-success-message']}>{successMessage}</p>} {/* Display success message if any */}

                        {/* Sign Up */}
                        <div className={styles['sign-up']}>
                            <h3 className={styles['small-sign-up-text']}>Don't have an account?</h3>
                            <Link to="/SignUp" className={styles['sign-up-link']}>Sign Up</Link>
                        </div>

                        {/* Forgot Password */}
                        <div className={styles['forgot-password']}>
                            <h3 className={styles['password-reset-text']}>Forgot your password?</h3>
                            <a href="/ResetPassword" className={styles['reset-password-link']}>Reset Password</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
