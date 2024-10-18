import React from 'react';
import './SignUp.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function SignUp() {


    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    //Email Validation function using regex:
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setError("Passwords do not match");
            return; //Prevents form submission

           
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return; //Prevents form submission

 
         }

        try {
            const response = await axios.post('http://localhost:5000/SignUp', {
                email,
                password
            });
            //clears any previous errors on success:
            setError('');

            alert(response.data.message);
        } catch (error) {
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };
    

    return (
        <div className="sign-up-main-container">
            <SideMenu />
            <header>
            <div className="sign-up-logo-container">
                <a href="/">
                <img
                    src={OfficialLogo}
                    alt="Official Logo"
                    className="sign-up-center-logo"
                />
                </a>
            </div>

            {/* Background Image */}
            <img
                src={MenuAlt}
                alt="background"
                className="sign-up-background-image"
            />

            {/* Left Image: Submit Landlord Rate */}
            <img
                src={SubmitLandlordRate}
                alt="Submit Landlord Rate"
                className="sign-up-left-icon"
            />

            {/* Right Image: Account Button */}
            <a href="signin">
                <img
                    src={AccountButton}
                    alt="Account Button"
                    className="sign-up-account-right"
                />
            </a>
            </header>

            <div className="sign-up-wrapper">
                <div className="sign-up-form-box-login">
                    <h1 className="sign-up-text">Sign Up</h1>
                    <form onSubmit={handleSignUp}>{/*Form Submission triggers handleSignUp*/ }
                        {/* Email */}
                        <div className="sign-up-input-box">
                            <span className="icon">
                                <input type="email"
                                    className="sign-up-email-box"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} //bind to email state
                                />
                                <label className="sign-up-email-text">Email:</label>
                            </span>
                        </div>

                        {/* Password */}
                        <div className="sign-up-input-box">
                            <span className="icon">
                                <input type="password"
                                    className="sign-up-password-box"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} //Bind to password state
                                    placeholder="At least 6 characters with 1 number" />
                                <label className="sign-up-password-text">Password:</label>
                            </span>
                        </div>

                        {/* Password Confirm */}
                        <div className="sign-up-input-type">
                            <span className="icon">
                                <input type="password"
                                    className="sign-up-password-confirm"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)} //Bind to confirmation of Password
                                />
                                <label className="sign-up-password-confirm-text">Re-enter Password:</label>
                            </span>
                        </div>

                        {/* Submit button */}
                        <button input type="submit" className="sign-up-submit-button">Sign Up</button>
                        {/* Move the error message here to position it below the button */}
                        {error && <p className="error">{error}</p>}{/*Display error in red*/}

                        {/* Sign In */}
                        <div className="sign-in">
                            <h3 className="small-sign-in-text">Already have an account?</h3>
                            <Link to="/SignIn" className="sign-in-link">Sign In</Link>
                        </div>


                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;