import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RightButtons.module.css';
import AccountIcon from '../Assets/my-account.svg';
import TopRightAddIcon from '../Assets/topright-add.svg';

const RightButtons = () => {
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
                <a href="/myaccount">
                    <img
                        src={AccountIcon}
                        alt="Account"
                        className={`${styles["nav-icon"]} ${styles["account-icon"]}`}
                    />
                </a>
            </div>
        </div>
    );
};

export default RightButtons;
