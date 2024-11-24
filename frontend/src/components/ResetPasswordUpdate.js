import React, { useState, useEffect } from 'react';
import styles from './ResetPasswordUpdate.module.css';
import OfficialLogo from '../Assets/official logo.svg';
import AccountButton from '../Assets/Account button.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import MenuAlt from '../Assets/menu-alt.svg';
import SideMenu from './SideMenu';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPasswordUpdate() {
    const navigate = useNavigate();
    const { token } = useParams();  // Get the token from the URL

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch the email associated with the token by decoding it (on the server side)
    useEffect(() => {
        const fetchEmailFromToken = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/verify-token/${token}`);
                const data = await response.json();
                if (response.ok) {
                    setEmail(data.email);  // Set the decoded email from token
                } else {
                    setErrorMessage(data.error || "Invalid token. Please try resetting your password again.");
                    navigate('/resetpassword');
                }
            } catch (error) {
                setErrorMessage("An error occurred. Please try again.");
                navigate('/resetpassword');
            }
        };

        fetchEmailFromToken();
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            setSuccessMessage('');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Password updated successfully!');
                setErrorMessage('');
                setTimeout(() => navigate('/signin'), 2000);
            } else {
                setErrorMessage(data.error || "Password update failed.");
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            setSuccessMessage('');
        }
    };

    return (
        <div className={styles['reset-password-update-main-container']}>
            <SideMenu />
            <header>
                <div className={styles['reset-password-update-logo-container']}>
                    <a href="/">
                        <img 
                            src={OfficialLogo} 
                            alt="OfficialLogo" 
                            className={styles['reset-password-update-center-logo']} 
                        />
                    </a>
                </div>

                <img 
                    src={MenuAlt} 
                    alt="background" 
                    className={styles['reset-password-update-background-image']} 
                />
                <img 
                    src={SubmitLandlordRate} 
                    alt="Submit Landlord Rate" 
                    className={styles['reset-password-update-left-icon']} 
                    onClick={() => navigate('/addalandlord')} 
                />
                <img 
                    src={AccountButton} 
                    alt="Account Button" 
                    className={styles['reset-password-update-account-right']} 
                    onClick={() => navigate('/myaccount')} 
                />
            </header>

            <div className={styles['reset-password-update-wrapper']}>
                <div className={styles['reset-password-update-form-box-login']}>
                    <h1 className={styles['reset-password-update-text']}>Reset Password</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles['reset-password-update-input-box']}>
                            <span className={styles['icon']}>
                                <input
                                    type="email"
                                    className={styles['reset-password-update-email-box']}
                                    value={email}
                                    readOnly
                                />
                                <label className={styles['reset-password-update-email-text']}>Email:</label>
                            </span>
                        </div>

                        <div className={styles['reset-password-update-input-box']}>
                            <span className={styles['icon']}>
                                <input
                                    type="password"
                                    className={styles['reset-password-update-password-box']}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="At least 6 characters with 1 number"
                                />
                                <label className={styles['reset-password-update-password-text']}>New Password:</label>
                            </span>
                        </div>

                        <div className={styles['reset-password-update-input-type']}>
                            <span className={styles['icon']}>
                                <input
                                    type="password"
                                    className={styles['reset-password-update-confirm-box']}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <label className={styles['reset-password-update-confirm-text']}>Re-enter Password:</label>
                            </span>
                        </div>

                        {errorMessage && <div className={styles['reset-password-update-error']}>{errorMessage}</div>}
                        {successMessage && <div className={styles['reset-password-update-success']}>{successMessage}</div>}

                        <button type="submit" className={styles['reset-password-update-continue-button']}>Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordUpdate;
