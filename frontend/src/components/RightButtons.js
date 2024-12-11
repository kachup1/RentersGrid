import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RightButtons.module.css';
import AccountIcon from '../Assets/my-account.svg';
import TopRightAddIcon from '../Assets/topright-add.svg';
import { isTokenValid } from './authentication'; // Import the authentication utility

const RightButtons = () => {
    const isSignedIn = isTokenValid(); // Check if the user is signed in

    return (
        <div className={styles["right-buttons-container"]}>
            {/* Top-Right Icons */}
            <div className={styles["top-right-icons"]}>
                <Link to="/addalandlord">
                    <img
                        src={TopRightAddIcon}
                        alt="Add"
                        className={`${styles["nav-icon"]} ${styles["add-icon"]}`}
                    />
                </Link>
                <div className={styles["account-button-wrapper"]}>
                    <a href="/myaccount">
                        <img
                            src={AccountIcon}
                            alt="Account"
                            className={`${styles["nav-icon"]} ${styles["account-icon"]}`}
                        />
                    </a>
                    {isSignedIn && (
                            <div className={styles.signedInIndicator} title="Signed In"></div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default RightButtons;
