import React, { useState } from 'react';
import './ResetPasswordUpdate.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import { useLocation} from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate();
    
    // State to hold the input values
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();
    const emailFromReset = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
   
        // Basic validation
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
   
        // Make API call to update password
        try {
            const response = await fetch('http://localhost:5000/ChangePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Convert to JSON string
                body: JSON.stringify({ email: emailFromReset, new_password: newPassword }),
            });
   
            const data = await response.json();
   
            if (response.ok) {
                setSuccessMessage(data.message);
                // Optionally navigate to signin or another page
                setTimeout(() => navigate('/signin'), 2000);
            } else {
                setErrorMessage(data.error || "Password update failed.");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };
   

    return (
        <div className="reset-password-update-main-container">
            <SideMenu />
            <header>
                <div className="reset-password-update-logo-container">
                    <a href="/">
                        <img src={OfficialLogo} alt="OfficialLogo" className="reset-password-update-center-logo" />
                    </a>
                </div>

                {/* Background Image */}
                <img src={MenuAlt} alt="background" className="reset-password-update-background-image" />

                {/* Left Image: Submit Landlord Rate */}
                <img src={SubmitLandlordRate} alt="Submit Landlord Rate" className="reset-password-update-left-icon" />

                {/* Right Image: Account Button */}
                <a href="signin">
                    <img src={AccountButton} alt="Account Button" className="reset-password-update-account-right" />
                </a>
            </header>

            <div className="reset-password-update-wrapper">
                <div className="reset-password-update-form-box-login">
                    <h1 className='reset-password-update-text'>Reset Password</h1>
                    <form onSubmit={handleSubmit}>
                        {/* Email Input - Autofilled */}
                        <div className="reset-password-update-input-box">
                            <span className="icon">
                                <input
                                    type="email"
                                    className="reset-password-update-email-box"
                                    value={emailFromReset}
                                    readOnly
                                />
                                <label className="reset-password-update-email-text">Email:</label>
                            </span>
                        </div>

                        {/* New Password */}
                        <div className="reset-password-update-input-box">
                            <span className="icon">
                                <input
                                    type="password"
                                    className="reset-password-update-password-box"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="At least 6 characters with 1 number"
                                />
                                <label className="reset-password-update-password-text">New Password:</label>
                            </span>
                        </div>

                        {/* Password Confirm */}
                        <div className="reset-password-update-input-type">
                            <span className="icon">
                                <input
                                    type="password"
                                    className="reset-password-update-confirm-box"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <label className="reset-password-update-confirm-text">Re-enter Password:</label>
                            </span>
                        </div>

                        {/* Error and Success Messages */}
                        {errorMessage && <div className="reset-password-update-error">{errorMessage}</div>}
                        {successMessage && <div className="reset-password-update-success">{successMessage}</div>}

                        {/* Submit Button */}
                        <button type="submit" className="reset-password-update-continue-button">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;