import React, { useState, useEffect } from 'react';
import styles from './MyAccount.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';


import EditIcon from '../Assets/edit.svg';
import SaveIcon from '../Assets/save.svg';

import BackgroundLogo from '../Assets/myaccount-bg.svg';
import TopRightAddIcon from '../Assets/topright-add.svg'

import EditSelected from '../Assets/edit-green.svg';
import SaveSelected from '../Assets/save-green.svg';

import Show from '../Assets/show-on.svg';
import ShowOff from '../Assets/show-off.svg';
import AccountIcon from '../Assets/my-account.svg';


import InsideAccountSideMenu from '../components/InsideAccountSideMenu';

const MyAccount = () => {
    // State variables for email, password, and edit mode
    const [email, setEmail] = useState(''); // Example initial value
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

    const [currentPassword, setCurrentPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false); // State to toggle current password visibility

    const [initialEmail, setInitialEmail] = useState('');
    const [initialPassword, setInitialPassword] = useState('');


    useEffect(() => {
        // IF NOT SIGNED IN IT WILL REDIRECT TO HOMEPAGE
        const token = localStorage.getItem('token'); // Get the token from localStorage
        // Redirect to homepage if token is missing
        if (!token) {
            window.location.href = '/';
            return;
        }
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // Get the token from localStorage
            if (!token) {
                console.error("No token found");
                return;
            }
    
            try {
                // Make a GET request to fetch the user data using the token
                const response = await axios.get('http://localhost:5000/api/get_user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                if (response.status === 200) {
                    setEmail(response.data.email);
                    setPassword(response.data.password);
                    setInitialEmail(response.data.email); // Set initial email
                    setInitialPassword(response.data.password); // Set initial password
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert("Failed to fetch user data.");
            }
        };
    
        fetchUserData();
    }, []);
    
    // Function to handle saving changes
    const handleSave = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    // Check if the user is in edit mode
    if (!isEditing) {
        setErrorMessage("Please click the edit button to make any changes.");
        return;
    }

    // Check if the current password is provided
    if (!currentPassword) {
        setErrorMessage("Current password is required to make any changes!");
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        setErrorMessage("User not authenticated. Please sign in.");
        return;
    }

    // Step 1: Verify the current password
    try {
        const verifyResponse = await axios.post('http://localhost:5000/api/verify_password', {
            currentPassword
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (verifyResponse.status !== 200) {
            setErrorMessage("Incorrect current password. Please try again.");
            return;
        }
    } catch (error) {
        setErrorMessage("Error verifying password. Please try again.");
        return;
    }

    let emailUpdated = email !== initialEmail;
    let passwordUpdated = password && confirmPassword && password !== initialPassword;

    // If neither email nor password was updated, show an error message
    if (!emailUpdated && !passwordUpdated) {
        setSuccessMessage("No changes made.");
        return;
    }

    // Step 2: Proceed with updating email or password
    try {
        const response = await axios.post('http://localhost:5000/api/edit_user', {
            email,
            currentPassword,
            newPassword: password
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
            // Check for "No changes made" message from the server
            if (response.data.message === 'No changes made') {
                setErrorMessage("No changes made. Please update your information.");
            } else {
                setSuccessMessage("User updated successfully!");
                setInitialEmail(email);
                setInitialPassword(password);
                setIsSaved(true);
            }
        } else {
            setErrorMessage(response.data.error || "Failed to update user.");
        }
    } catch (error) {
        setErrorMessage("Failed to update user. Please try again.");
    }
};

    
    return (
        <div className={styles["my-account-container"]}>
            <InsideAccountSideMenu />
            {/* main content*/}
            <main className={styles["main-content"]}>
                {/* Background logo */}
                <img src={BackgroundLogo} alt="Background Logo" className={styles["background-logo"]} />

                {/* Top-Right Icons */}
                <div className={styles["top-right-icons"]}>
                    <Link to="/addalandlord">
                        <img
                            src={TopRightAddIcon}
                            alt="Add"
                            className={`${styles["nav-icon"]} ${styles["add-icon"]}`}
                        />
                    </Link>
                    <a href="/myaccount">
                        <img
                            src={AccountIcon}
                            alt="Account"
                            className={`${styles["nav-icon"]} ${styles["account-icon"]}`}
                        />
                    </a>

                </div>
                
                <div className={styles["title-container"]}>
                    <img src={AccountIcon} alt="Account" className={styles.titleicon} />
                    <h2>Hello!</h2>
                </div>

                {/* User Info Form */}
                <div className={styles["user-info-container"]}>
                    {/* Email Input */}
                    <div className={styles["input-group"]}>
                        <label>Email Address:</label>
                        <div className={styles["input-with-icons"]}>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                readOnly={!isEditing}
                            />
                            <img
                                src={isEditing ? EditSelected : EditIcon}
                                alt="Edit"
                                className={styles.mainicon}
                                onClick={() => setIsEditing(!isEditing)}
                            />

                            <img
                                src={isSaved ? SaveSelected : SaveIcon}
                                alt="Save"
                                className={styles.mainicon}
                                onClick={handleSave}
                                style={{
                                    cursor: isEditing ? 'pointer' : 'not-allowed',
                                    opacity: isEditing ? 1 : 0.2
                                }}
                            />

                        </div>
                    </div>

                    {/* Current Password Input */}
                    <div className={styles["input-group"]}>
                        <label>Current Password:</label>
                        <div className={styles["input-with-icons"]}>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter Current Password"
                            />
                            {/* Toggle button to show/hide current password */}
                            <img
                                src={showCurrentPassword ? Show : ShowOff}
                                alt={showCurrentPassword ? "Hide" : "Show"}
                                className={styles.showicon}
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className={styles["input-group"]}>
                        <label>New Password:</label>
                        <div className={styles["input-with-icons"]}>
                            {/* Password input field */}
                            <input
                                type={showPassword ? "text" : "password"} // Toggle between 'text' and 'password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                readOnly={!isEditing}
                                placeholder="Password"
                            />
                            {/* Toggle button to show/hide password */}
                            <img
                                src={showPassword ? Show : ShowOff } // Change the icon if you have one, else use text
                                alt={showPassword ? "Hide" : "Show"}
                                className={styles.showicon}
                                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                            />
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className={`${styles["input-group"]} ${styles["confirm-group"]}`}>
                        <div className={styles["input-with-icons"]}>
                            <input
                                type={showConfirmPassword ? "text" : "password"} // Toggle for confirm password
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                readOnly={!isEditing}
                                placeholder="Confirm Password"
                            />
                            {/* Toggle button for confirm password */}
                            <img
                                src={showConfirmPassword ? Show : ShowOff }
                                alt={showConfirmPassword ? "Hide" : "Show"}
                                className={styles.showicon}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </div>
                    </div>

                    {/* Display Success and Error Messages */}
                {successMessage && (
                    <div className={styles.successMessage}>{successMessage}</div>
                )}
                {errorMessage && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}
                </div>

            </main>
        </div>
    );
};

export default MyAccount;
