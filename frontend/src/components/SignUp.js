import React from 'react';
import './SignUp.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function SignUp() {
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
                    <form action="#">
                        {/* Email */}
                        <div className="sign-up-input-box">
                            <span className="icon">
                                <input type="email" className="sign-up-email-box" required />
                                <label className="sign-up-email-text">Email:</label>
                            </span>
                        </div>

                        {/* Password */}
                        <div className="sign-up-input-box">
                            <span className="icon">
                                <input type="password" className="sign-up-password-box" required placeholder="At least 6 characters with 1 number" />
                                <label className="sign-up-password-text">Password:</label>
                            </span>
                        </div>

                        {/* Password Confirm */}
                        <div className="sign-up-input-type">
                            <span className="icon">
                                <input type="password" className="sign-up-password-confirm" required />
                                <label className="sign-up-password-confirm-text">Re-enter Password:</label>
                            </span>
                        </div>

                        {/* Submit button */}
                        <button input type="submit" className="sign-up-submit-button">Sign Up</button>

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