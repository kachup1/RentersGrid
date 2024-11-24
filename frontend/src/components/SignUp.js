import React from 'react';
import styles from './SignUp.module.css';
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
    const navigate = useNavigate();

    // Email Validation function using regex
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }


    const validatePassword = (password) => {
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (!hasNumber && !hasSpecialChar) {
            return "Password must include at least one number and one special character.";
        }
        if (!hasNumber) {
            return "Password must include at least one number.";
        }
        if (!hasSpecialChar) {
            return "Password must include at least one special character.";
        }
        return ""; // No errors
    };


    const handleSignUp = async (e) => {
        e.preventDefault();
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError); // Set specific password error
            return; // Prevent form submission
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return; // Prevent form submission
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
            // Clears any previous errors on success
            setError('');

            alert(response.data.message);
            //redirection to homepage
            navigate('/');

        } catch (error) {
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };


    return (
        <div className={styles['sign-up-main-container']}>
            <SideMenu />
            <header>
                <div className={styles['sign-up-logo-container']}>
                    <a href="/">
                        <img
                            src={OfficialLogo}
                            alt="Official Logo"
                            className={styles['sign-up-center-logo']}
                        />
                    </a>
                </div>

                {/* Background Image */}
                <img
                    src={MenuAlt}
                    alt="background"
                    className={styles['sign-up-background-image']}
                />

                {/* Left Image: Submit Landlord Rate */}
                <img
                    src={SubmitLandlordRate}
                    alt="Submit Landlord Rate"
                    className={styles['sign-up-left-icon']}
                />

                {/* Right Image: Account Button */}
                <a href="signin">
                    <img
                        src={AccountButton}
                        alt="Account Button"
                        className={styles['sign-up-account-right']}
                    />
                </a>
            </header>

            <div className={styles['sign-up-wrapper']}>
                <div className={styles['sign-up-form-box-login']}>
                    <h1 className={styles['sign-up-text']}>Sign Up</h1>
                    <form onSubmit={handleSignUp}>{/* Form Submission triggers handleSignUp */}
                        {/* Email */}
                        <div className={styles['sign-up-input-box']}>
                            <span className={styles['icon']}>
                                <input
                                    type="email"
                                    className={styles['sign-up-email-box']}
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} // bind to email state
                                />
                                <label className={styles['sign-up-email-text']}>Email:</label>
                            </span>
                        </div>

                        {/* Password */}
                        <div className={styles['sign-up-input-box']}>
                            <span className={styles['icon']}>
                                <input
                                    type="password"
                                    className={styles['sign-up-password-box']}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} //Bind to password state
                                    placeholder=" At least 6 characters, 1 number, and 1 special character." />

                                <label className={styles['sign-up-password-text']}>Password:</label>
                            </span>
                        </div>

                        {/* Password Confirm */}
                        <div className={styles['sign-up-input-type']}>
                            <span className={styles['icon']}>
                                <input
                                    type="password"
                                    className={styles['sign-up-password-confirm']}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)} // Bind to confirmation of Password
                                />
                                <label className={styles['sign-up-password-confirm-text']}>Re-enter Password:</label>
                            </span>
                        </div>

                        {/* Submit button */}
                        <button input type="submit" className={styles['sign-up-submit-button']}>Sign Up</button>

                        {/* Move the error message here to position it below the button */}
                        {error && <p className={styles['error']}>{error}</p>}{/*Display error in red*/}

                        {/* Sign In */}
                        <div className={styles['sign-in']}>
                            <h3 className={styles['small-sign-in-text']}>Already have an account?</h3>
                            <Link to="/SignIn" className={styles['sign-in-link']}>Sign In</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
