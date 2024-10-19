import React from 'react';
import './SignIn.css'; 
import OfficialLogo from '../Assets/official logo.svg'; 
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import SideMenu from './SideMenu';

function SignIn() {
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
                    <form action="#">
                        {/* Email */}
                        <div className="sign-in-input-box">
                            <span className="icon">
                                <input type="email" className="sign-in-email-box" required />
                                <label className="sign-in-email-text">Email:</label>
                            </span>
                        </div>

                        {/* Password */}
                        <div className="sign-in-input-box">
                            <span className="icon">
                                <input type="password" className="sign-in-password-box" required />
                                <label className="sign-in-password-text">Password:</label>
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button input type="submit" className="sign-in-submit-button">Sign In</button>

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