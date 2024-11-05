import React from 'react';
import styles from './MyAccount.module.css';

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

const MyAccount = () => {
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
                            My Account
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
                    <div className={styles["input-group"]}>
                        <label>Email Address:</label>
                        <div className={styles["input-with-icons"]}>
                            <input type="text" placeholder="Email Address" /> {/* Add readOnly */}
                            <img src={EditIcon} alt="Edit" className={styles.mainicon} />
                            <img src={SaveIcon} alt="Save" className={styles.mainicon} />
                        </div>
                    </div>

                    <div className={styles["input-group"]}>
                        <label>Password:</label>
                        <div className={styles["input-with-icons"]}>
                            <input type="password" placeholder="Password" /> {/* Add readOnly */}
                            <img src={EditIcon} alt="Edit" className={styles.mainicon} />
                            <img src={SaveIcon} alt="Save" className={styles.mainicon} />
                        </div>
                    </div>
                    <div className={`${styles["input-group"]} ${styles["confirm-group"]}`}> {/* Add confirm-group class here */}
                        <div className={styles["input-with-icons"]}>
                            <input type="password" placeholder="Confirm Password" />
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default MyAccount;
