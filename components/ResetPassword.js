import React from 'react';
import './ResetPassword.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import SideMenu from './SideMenu';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate();
    return (
        <div className="reset-password-main-container">
            <SideMenu />
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
                    <form action="#">
                        {/* Email */}
                        <div className="reset-password-input-box">
                            <span className="icon">
                                <input type="email" className="reset-password-email-box" required />
                                <label className="reset-password-email-text">Email:</label>
                            </span>
                        </div>

                        {/* Submit Button */}
                        
                        <button onClick={() => navigate('/resetpasswordupdate')} input type="submit" className="reset-password-continue-button">Continue</button>
                        
                        {/* Sign In*/}
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