import React from 'react';
import styles from './PopUpMenu.module.css';
import { isTokenValid } from './authentication'; // Import token utility
import { useNavigate } from 'react-router-dom';

// SVG Imports
import HomepageIcon from '../Assets/home.svg';
import SearchIcon from '../Assets/menu-1.svg';
import AddLandlordIcon from '../Assets/menu-2.svg';
import SignInIcon from '../Assets/signin signup.svg';
import CloseIcon from '../Assets/closebuttonforpopupmenu.svg';
import LogoIcon from '../Assets/3-ppl-icon.svg';

// Signed In Icons
import MyRatingsIcon from '../Assets/my-rating.svg';
import SignOutIcon from '../Assets/signout.svg';
import MyBookmarksIcon from '../Assets/my-book.svg';
import MyAccountIcon from '../Assets/my-account.svg';

const PopUpMenu = ({ isOpen, onClose }) => {
    // Check if user is signed in
    const isSignedIn = isTokenValid();
    const navigate = useNavigate();
    // Function to handle sign out
    const handleSignOut = () => {
        localStorage.removeItem('token'); // Clear token from localStorage
        window.location.reload(); // Refresh the page to reflect the change
    };

    // Adjust menu box height based on whether the user is signed in
    const menuHeightClass = isSignedIn ? styles.signedInMenu : styles.signedOutMenu;

    return (
        <div className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
            {/* Close Button Section */}
            <div className={styles.closeContainer}>
                <button className={styles.closeButton} onClick={onClose}>
                    <img src={CloseIcon} alt="Close" className={styles.closeIcon} />
                </button>
            </div>

            {/* Center Logo Section */}
            <div className={styles.logoContainer}>
                <img src={LogoIcon} alt="Logo" className={styles.logo} />
            </div>

            {/* Menu Section */}
            <div className={styles.menuContainer}>
            <ul className={styles.menuList}>
            {/* Homepage */}
            <li className={`${styles.menuItem} ${styles.homepageItem}`} onClick={() => {
                if (window.location.pathname === '/') {
                    window.location.reload();
                } else {
                    navigate('/');
                }
            }}>
                <img src={HomepageIcon} alt="Homepage" className={`${styles.icon} ${styles.homepageIcon}`} />
                <span>Homepage</span>
            </li>

            {/* Search */}
            <li className={styles.menuItem} onClick={() => {
                if (window.location.pathname === '/searchresults') {
                    window.location.reload();
                } else {
                    navigate('/searchresults');
                }
            }}>
                <img src={SearchIcon} alt="Search" className={styles.icon} />
                <span>Search</span>
            </li>

            {/* Add a Landlord */}
            <li className={styles.menuItem} onClick={() => {
                if (window.location.pathname === '/addalandlord') {
                    window.location.reload();
                } else {
                    navigate('/addalandlord');
                }
            }}>
                <img src={AddLandlordIcon} alt="Add a Landlord" className={styles.icon} />
                <span>Add a Landlord</span>
            </li>
            

                    
            {isSignedIn && (
                <>
                    {/* Sign Out */}
                    <li className={styles.menuItem} onClick={handleSignOut}>
                        <img src={SignOutIcon} alt="Sign Out" className={styles.icon} />
                        <span>Sign Out</span>
                    </li>
                    {/* My Account (Signed In) */}
                    <li className={`${styles.menuItem} ${styles.myAccount}`} onClick={() => {
                        if (window.location.pathname === '/myaccount') {
                            window.location.reload();
                        } else {
                            navigate('/myaccount');
                        }
                    }}>
                        <img src={MyAccountIcon} alt="My Account" className={styles.icon} />
                        <span>My Account</span>
                    </li>

                    {/* My Ratings */}
                    <li className={styles.menuItem} onClick={() => {
                        if (window.location.pathname === '/myratings') {
                            window.location.reload();
                        } else {
                            navigate('/myratings');
                        }
                    }}>
                        <img src={MyRatingsIcon} alt="My Ratings" className={styles.icon} />
                        <span>My Ratings</span>
                    </li>

                    {/* My Bookmarks */}
                    <li className={styles.menuItem} onClick={() => {
                        if (window.location.pathname === '/bookmarks') {
                            window.location.reload();
                        } else {
                            navigate('/bookmarks');
                        }
                    }}>
                        <img src={MyBookmarksIcon} alt="My Bookmarks" className={styles.icon} />
                        <span>My Bookmarks</span>
                    </li>
                </>
            )}

            {/* Sign In / Sign Up (Not Signed In) */}
            {!isSignedIn && (
                <li className={styles.menuItem} onClick={() => {
                    if (window.location.pathname === '/signin') {
                        window.location.reload();
                    } else {
                        navigate('/signin');
                    }
                }}>
                    <img src={SignInIcon} alt="Sign In / Sign Up" className={styles.icon} />
                    <span>Sign In / Sign Up</span>
                </li>
            )}
        </ul>

                    
            </div>
        </div>
    );
};

export default PopUpMenu;
