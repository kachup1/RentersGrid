import React from 'react';
import './ResetPasswordUpdate.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate();
    return (
        <div className="reset-password-update-main-container">
            <SideMenu />
            <header>
                <div className="reset-password-update-logo-container">
                    <a href="/">
                    <img
                        src={OfficialLogo}
                        alt="OfficialLogo"
                        className="reset-password-update-center-logo"
                        />
                    </a>
                </div>

                {/* Background Image */}
                <img
                    src={MenuAlt}
                    alt="background"
                    className="reset-password-update-background-image"
                />

                {/* Left Image: Submit Landlord Rate */}
                <img
                    src={SubmitLandlordRate}
                    alt="Submit Landlord Rate"
                    className="reset-password-update-left-icon"
                />

                {/* Right Image: Account Button */}
                <a href="signin">
                    <img
                        src={AccountButton}
                        alt="Account Button"
                        className="reset-password-update-account-right"
                    />
                </a>
            </header>

            <div className="reset-password-update-wrapper">
                <div className="reset-password-update-form-box-login">
                    <h1 className='reset-password-update-text'>Reset Password</h1>
                    <form action="#">
                        {/* Email */}
                        <div className="reset-password-update-input-box">
                            <span className="icon">
                                <input type="email" className="reset-password-update-email-box" required />
                                <label className="reset-password-update-email-text">Email:</label>
                            </span>
                        </div>

                        {/* Password */}
                        <div className="reset-password-update-input-box">
                            <span className="icon">
                                <input type="password" className="reset-password-update-password-box" required placeholder="At least 6 characters with 1 number " />
                                <label className="reset-password-update-password-text" >Password:</label>
                            </span>
                        </div>

                        {/* Password Confirm */}
                        <div className="reset-password-update-input-type">
                            <span className="icon">
                                <input type="password" className="reset-password-update-confirm-box" required />
                                <label className="reset-password-update-confirm-text" >Re-enter Password:</label>
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button onClick={() => navigate('/signin')}input type="submit" className="reset-password-update-continue-button">Update Password</button>

                    </form>
                </div>
            </div>


        </div>
    );
}
export default ResetPassword;