import React, { useState } from 'react'; // Import useState
import './SignIn.css'; 
import OfficialLogo from '../Assets/official logo.svg'; 
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SideMenu from './SideMenu';
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

            // Optional: Redirect to the profile page after a short delay
            setTimeout(() => {
                navigate('/Profile'); // Redirect to the profile page
            }, 2000); // Redirect after 2 seconds

        } catch (err) {
            console.error(err); // Log the full error object
            setError(err.response?.data?.error || 'An error occurred.'); // Set the error message if login fails
        }
        
    };

    return (
        <div className="sign-in-main-container">  
            <SideMenu />
            <header>
                {/* Home Page + logo */}
                <div className="sign-in-logo-container">
                    <a href="/">
                        <img
                            src={OfficialLogo}
                            alt="Official Logo"
                            className="sign-in-center-logo"
                        />
                    </a>
                </div>

                {/* Background Image */}
                <img
                    src={MenuAlt}
                    alt="background"
                    className="sign-in-background-image"
                />

                {/* Left Image: Submit Landlord Rate */}
                <img
                    src={SubmitLandlordRate}
                    alt="Submit Landlord Rate"
                    className="sign-in-left-icon"
                />

                {/* Right Image: Account Button */}
                <a href="SignIn">
                    <img
                        src={AccountButton}
                        alt="Account Button"
                        className="sign-in-account-right"
                    />
                </a>
            </header>

            <div className="sign-in-wrapper">
                <div className="sign-in-form-box-login">
                    <h1 className="sign-in-text">Sign In</h1>
                    <form onSubmit={handleSubmit}> {/* Call handleSubmit on form submission */}
                        {/* Email */}
                        <div className="sign-in-input-box">
                            <span className="icon">
                                <input
                                    type="email"
                                    className="sign-in-email-box"
                                    required
                                    value={email} // Bind email state to input
                                    onChange={(e) => setEmail(e.target.value)} // Update email state on change
                                />
                                <label className="sign-in-email-text">Email:</label>
                            </span>
                        </div>

                        {/* Password */}
                        <div className="sign-in-input-box">
                            <span className="icon">
                                <input
                                    type="password"
                                    className="sign-in-password-box"
                                    required
                                    value={password} // Bind password state to input
                                    onChange={(e) => setPassword(e.target.value)} // Update password state on change
                                />
                                <label className="sign-in-password-text">Password:</label>
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="sign-in-submit-button">Sign In</button>

                        {/* Error Message */}
                        {error && <p className="error-message">{error}</p>} {/* Display error message if any */}

                        {/* Success Message */}
                        {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message if any */}

                        {/* Sign Up */}
                        <div className="sign-up">
                            <h3 className="small-sign-up-text">Don't have an account?</h3>
                            <Link to="/SignUp" className="sign-up-link">Sign Up</Link>
                        </div>

                        {/* Forgot Password */}
                        <div className="forgot-password">
                            <h3 className="password-reset-text">Forgot your password?</h3>
                            <a href="#" className="reset-password-link">Reset Password</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
