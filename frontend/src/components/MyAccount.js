import React, { useState, useEffect } from 'react';
import styles from './MyAccount.module.css';
import axios from 'axios';

import Logo from '../Assets/logo.svg'
import HomeIcon from '../Assets/home.svg';
import SearchIcon from '../Assets/search.svg';
import AddLandlordIcon from '../Assets/add-a-landlord.svg';
import SignOutIcon from '../Assets/signout.svg';
import AccountIcon from '../Assets/my-account.svg';
import RatingsIcon from '../Assets/my-rate.svg';
import BookmarksIcon from '../Assets/my-book.svg';

import EditIcon from '../Assets/edit.svg';
import SaveIcon from '../Assets/save.svg';

import BackgroundLogo from '../Assets/myaccount-bg.svg';

import TopRightAddIcon from '../Assets/topright-add.svg'
import Triangle from '../Assets/triangle.svg'

import EditSelected from '../Assets/edit-green.svg';
import SaveSelected from '../Assets/save-green.svg';

import Show from '../Assets/show-on.svg';
import ShowOff from '../Assets/show-off.svg';

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



    // Assume userId = 1 for unit testing
    const userId = 1;

    // Fetch user data when the component loads
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/get_user', {
                    params: { userId }
                });
                if (response.status === 200) {
                    setEmail(response.data.email);
                    setPassword(response.data.password); // Note: Avoid displaying plain passwords in production
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert("Failed to fetch user data.");
            }
        };
        fetchUserData();
    }, [userId]);


    // Function to handle saving changes
    const handleSave = async () => {

        setSuccessMessage('');
        setErrorMessage('');

        // Ensure both password fields match before sending
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match! Please try agian.");
            return;
        }
    
        // Ensure email and password fields are not empty
        if (!email || !password) {
            setErrorMessage("Email and password cannot be empty! Please try agian.");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/edit_user', {
                userId,
                email,
                password
            });
    
            if (response.status === 200) {
                setSuccessMessage("Great! User info updated successfully!");
                setIsEditing(false);
                setIsSaved(true);
                setTimeout(() => {
                    setIsSaved(false);
                    setSuccessMessage('');


                }, 5000); // Reset after 1 second
            }
        } catch (error) {
            console.error("Error updating user:", error);
            setErrorMessage("Failed to update user info.");
        }
    };
    
    return (
        <div className={styles["my-account-container"]}>

            {/* side menu*/}
            <aside className={styles["side-menu"]}>
                <div className={styles.logo}>
                    <img src={Logo} alt="Logo" />
                </div>
                <nav>
                    <ul>
                        <li>
                            <img src={HomeIcon} alt="Home" className={styles.icon} />
                            Homepage
                        </li>
                        <li>
                            <img src={SearchIcon} alt="Search" className={styles.icon} />
                            Search
                        </li>
                        <li>
                            <img src={AddLandlordIcon} alt="Add Landlord" className={styles.icon} />
                            Add a Landlord
                        </li>
                        <li>
                            <img src={SignOutIcon} alt="Sign Out" className={styles.icon} />
                            Sign Out
                        </li>
                    </ul>
                        <div style={{ margin: '50px 0' }}></div> {/* space between sign out and my account on sidemenu */}
                    <ul>
                        <li>
                            <img src={AccountIcon} alt="Account" className={styles.icon} />
                            My Account <img src={Triangle} alt="Triangle" className={styles.this} />
                        </li>
                        <li>
                            <img src={RatingsIcon} alt="Ratings" className={styles.icon} />
                            My Ratings
                        </li>
                        <li>
                            <img src={BookmarksIcon} alt="Bookmarks" className={styles.icon} />
                            My Bookmarks
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* main content*/}
            <main className={styles["main-content"]}>
                {/* Background logo */}
                <img src={BackgroundLogo} alt="Background Logo" className={styles["background-logo"]} />

                {/* Top-Right Icons */}
                <div className={styles["top-right-icons"]}>
                <img src={TopRightAddIcon} alt="Add" className={`${styles["nav-icon"]} ${styles["add-icon"]}`} />
                <img src={AccountIcon} alt="Account" className={`${styles["nav-icon"]} ${styles["account-icon"]}`} />

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
                            {/* Always show the Edit icon */}
                            <img
                                src={isEditing ? EditSelected : EditIcon}
                                alt="Edit"
                                className={styles.mainicon}
                                onClick={() => setIsEditing(!isEditing)}
                            />

                            {/* Always show the Save icon */}
                            <img
                                src={isSaved ? SaveSelected : SaveIcon}
                                alt="Save"
                                className={styles.mainicon}
                                onClick={handleSave}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className={styles["input-group"]}>
                        <label>Password:</label>
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
