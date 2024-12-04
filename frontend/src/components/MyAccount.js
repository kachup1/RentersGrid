import React, { useState, useEffect } from 'react';
import styles from './MyAccount.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';


import EditIcon from '../Assets/edit.svg';
import SaveIcon from '../Assets/save.svg';

import BackgroundLogo from '../Assets/myaccount-bg.svg';

import EditSelected from '../Assets/edit-green.svg';
import SaveSelected from '../Assets/save-green.svg';

import Show from '../Assets/show-on.svg';
import ShowOff from '../Assets/show-off.svg';
import AccountIcon from '../Assets/my-account.svg';


import RightButtons from './RightButtons';
import InsideAccountSideMenu from '../components/InsideAccountSideMenu';
import ConfirmationModal from './ConfirmationModal'; // Adjust the path if needed

const MyAccount = () => {
    // State variables for email, password, and edit mode
    const [email, setEmail] = useState(''); // Example initial value
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [setIsSaved] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

    const [currentPassword, setCurrentPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false); // State to toggle current password visibility

    const [initialEmail, setInitialEmail] = useState('');
    const [initialPassword, setInitialPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    
    const [isModalVisible, setIsModalVisible] = useState(false);


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
    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (!/\d/.test(password) && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must include at least one number and one special character.";
        }
        if (!/\d/.test(password)) {
            return "Password must include at least one number.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must include at least one special character.";
        }
        return ""; // No errors
    };
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [editMessage, setEditMessage] = useState(''); // To track the "click edit" message

    // Function to handle saving changes
    const handleSave = async () => {
        // Clear all messages initially
        setSuccessMessage('');
        setEmailError('');
        setCurrentPasswordError('');
        setNewPasswordError('');
        setConfirmPasswordError('');
    
        // Ensure editing mode is enabled
        if (!isEditing) {
            setEditMessage("Please click the edit button to make any changes.");
            return;
        }
    
        // Ensure current password is provided
        if (!currentPassword) {
            setCurrentPasswordError("Current password is required to make any changes!");
            return;
        }
    
        const token = localStorage.getItem('token');
        if (!token) {
            setCurrentPasswordError("User not authenticated. Please sign in.");
            return;
        }
    
        // Step 1: Verify current password
        try {
            const verifyResponse = await axios.post(
                'http://localhost:5000/api/verify_password',
                { currentPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (verifyResponse.status !== 200) {
                setCurrentPasswordError("Incorrect current password. Please try again.");
                return;
            }
        } catch (error) {
            setCurrentPasswordError("Error verifying password. Please try again.");
            return;
        }
    
        const emailUpdated = email !== initialEmail;
        const passwordUpdated = password || confirmPassword;
    
        // Check for incomplete password fields
        if (passwordUpdated) {
            if (!password) {
                setNewPasswordError("Please input New Password.");
                return;
            }
            if (!confirmPassword) {
                setConfirmPasswordError("Please input Confirm Password.");
                return;
            }
    
            // Validate new password if both fields are filled
            const passwordError = validatePassword(password);
            if (passwordError) {
                setNewPasswordError(passwordError);
                return;
            }
            if (password !== confirmPassword) {
                setConfirmPasswordError("Passwords do not match.");
                return;
            }
        }
    
        // If no updates are made, display a message
        if (!emailUpdated && !passwordUpdated) {
            setSuccessMessage("No changes made.");
            setCurrentPassword('');
            return;
        }
    
        // Step 2: Update email or password
        try {
            const response = await axios.post(
                'http://localhost:5000/api/edit_user',
                {
                    email,
                    currentPassword,
                    newPassword: passwordUpdated ? password : null,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // Handle response
            if (response.status === 200) {
                if (response.data.message === 'User updated successfully') {
                    setSuccessMessage("User updated successfully!");
                    setInitialEmail(email);
                    setInitialPassword(password);
                    setPassword(''); // Clear password fields
                    setConfirmPassword('');
                    setCurrentPassword(''); // Clear current password field
                    setIsEditing(false); // Exit editing mode
                } else if (response.data.message === 'No changes made') {
                    setSuccessMessage("No changes made. Please update your information.");
                } else {
                    setEmailError("Unexpected response from the server.");
                }
            } else {
                setEmailError("Failed to update user.");
            }
        } catch (error) {
            setEmailError("Failed to update user. Please try again.");
        }
    };
    
    const handleConfirmDelete = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
        if (!token) {
            alert("User not authenticated. Please log in again.");
            return;
        }
    
        try {
            // Send DELETE request to backend API
            const response = await axios.delete('http://localhost:5000/api/delete_account', {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.status === 200) {
                alert("Your account has been successfully deleted.");
                localStorage.removeItem('token'); // Remove token from localStorage
                window.location.href = '/'; // Redirect to homepage or login page
            } else {
                alert(response.data.error || "Failed to delete your account. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("An error occurred while trying to delete your account. Please try again.");
        }
    
        setIsModalVisible(false); // Hide the modal after confirming
    };
    
    const handleCancelDelete = () => {
        setIsModalVisible(false); // Close the modal
    };
    

    return (
        <div className={styles["my-account-container"]}>
            {/* Side Menu */}
            <InsideAccountSideMenu />
            
            {/* main content*/}
            <main className={styles["main-content"]}>
               
                {/* Background logo */}
                <img src={BackgroundLogo} alt="Background Logo" className={styles["background-logo"]} />

                {/* Title */}
                <div className={styles["title-container"]}>
                    <img src={AccountIcon} alt="Account" className={styles.titleicon} />
                    <h2>My Account</h2>
                </div>

                {/* Editing Button */}
                <div className={styles["edit-save-buttons"]}>
                    <button
                        className={styles.editButton}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={!isEditing} // Disable Save button if not in edit mode
                    >
                        Save
                    </button>
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
                                onChange={(e) => {
                                    if (isEditing) {
                                        setEmail(e.target.value);
                                    }
                                }}
                                onFocus={() => {
                                    if (!isEditing) {
                                        setEmailError("Please click the edit button to make any changes.");
                                    }
                                }}
                                readOnly={!isEditing}
                            />
                        </div>
                        {emailError && <div className={styles.errorMessage}>{emailError}</div>}
                    </div>



                    {/* Current Password Input */}
                    <div className={styles["input-group"]}>
                        <label>Current Password:</label>
                        <div className={styles["input-with-icons"]}>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => {
                                    if (isEditing) {
                                        setCurrentPassword(e.target.value);
                                    }
                                }}
                                onFocus={() => {
                                    if (!isEditing) {
                                        setCurrentPasswordError("Please click the edit button to make any changes.");
                                    }
                                }}
                                placeholder="Current Password"
                                readOnly={!isEditing}
                            />
                            <img
                                src={showCurrentPassword ? Show : ShowOff}
                                alt={showCurrentPassword ? "Hide" : "Show"}
                                className={styles.showicon}
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            />
                        </div>
                        {currentPasswordError && <div className={styles.errorMessage}>{currentPasswordError}</div>}
                    </div>


                    {/* New Password Input */}
                    <div className={styles["input-group"]}>
                        <label>New Password:</label>
                        <div className={styles["input-with-icons"]}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    if (isEditing) {
                                        const newPassword = e.target.value;
                                        setPassword(newPassword);
                                        setEditMessage(''); // Clear edit message

                                        // Validate new password and set error
                                        const error = validatePassword(newPassword);
                                        setNewPasswordError(error);
                                    }
                                }}
                                onFocus={() => {
                                    if (!isEditing) {
                                        setEditMessage('Please click the edit button to make any changes.');
                                    }
                                }}
                                readOnly={!isEditing}
                                placeholder="New Password"
                            />
                            <img
                                src={showPassword ? Show : ShowOff}
                                alt={showPassword ? "Hide" : "Show"}
                                className={styles.showicon}
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                        {/* Display New Password Error */}
                        {newPasswordError && <div className={styles.errorMessage}>{newPasswordError}</div>}
                    </div>

                    {/* Confirm Password Input */}
                    <div className={`${styles["input-group"]} ${styles["confirm-group"]}`}>
                        <div className={styles["input-with-icons"]}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => {
                                    if (isEditing) {
                                        const confirmation = e.target.value;
                                        setConfirmPassword(confirmation);
                                        setEditMessage(''); // Clear edit message

                                        // Check if passwords match and set error
                                        setConfirmPasswordError(
                                            confirmation !== password ? "Passwords do not match." : ""
                                        );
                                    }
                                }}
                                onFocus={() => {
                                    if (!isEditing) {
                                        setEditMessage('Please click the edit button to make any changes.');
                                    }
                                }}
                                readOnly={!isEditing}
                                placeholder="Confirm Password"
                            />
                            <img
                                src={showConfirmPassword ? Show : ShowOff}
                                alt={showConfirmPassword ? "Hide" : "Show"}
                                className={styles.showicon}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </div>
                        {/* Display Confirm Password Error */}
                        {confirmPasswordError && <div className={styles.errorMessage}>{confirmPasswordError}</div>}
                        {/* Display editMessage only under the confirmation field */}
                        {editMessage && !isEditing && <div className={styles.errorMessage}>{editMessage}</div>}
                    </div>

                    {/* Display Success and Error Messages */}
                    {successMessage && (
                        <div className={styles.successMessage}>{successMessage}</div>
                    )}

                   
                    {/* Delete Account Button */}
                    <div className={styles["delete-account-container"]}>
                        <button
                            className={styles["delete-account-button"]}
                            onClick={() => setIsModalVisible(true)}
                        >
                            Delete Account
                        </button>

                        {/* Render Confirmation Modal */}
                        {isModalVisible && (
                            <ConfirmationModal
                                message="Are you sure you want to delete your account? This action cannot be undone."
                                onConfirm={handleConfirmDelete}
                                onCancel={handleCancelDelete}
                            />
                        )}
                    </div>



                </div>

            </main>
             {/* Top-Right Icons */}
            <div className={styles["right-buttons"]}>
                    <RightButtons />
            </div>
        </div>
    );
};

export default MyAccount;
