import React from 'react';
import styles from './MyRatings.module.css';

import Logo from '../Assets/logo.svg'
import HomeIcon from '../Assets/home.svg';
import SearchIcon from '../Assets/search.svg';
import AddLandlordIcon from '../Assets/add-a-landlord.svg';
import SignOutIcon from '../Assets/signout.svg';
import AccountIcon from '../Assets/my-account.svg';
import RatingsIcon from '../Assets/my-rate.svg';
import BookmarksIcon from '../Assets/my-book.svg';

import BackgroundLogo from '../Assets/rate-bg.svg';

import TopRightAddIcon from '../Assets/topright-add.svg'

import EditIcon from '../Assets/edit.svg';
import DeleteIcon from '../Assets/delete.svg';
import Triangle from '../Assets/triangle.svg'


const MyRatings = () => {
    // Array of rating data
    const ratings = [
        {
            name: 'Ariana Grande',
            date: 'November 12, 2024',
            score: 3,
            comments: "My landlord is always quick to respond to maintenance requests, and every issue I've had was resolved within 24 hours. They even installed new appliances without extra charges. However, sometimes they don't give much notice before entering the property."
        },
        {
            name: 'Taylor Swift',
            date: 'December 5, 2024',
            score: 4,
            comments: "The landlord is very approachable and made the moving-in process smooth. However, they can be a bit slow with non-urgent repairs. I appreciate their transparency about any building changes and their flexibility with minor modifications."
        },
        {
            name: 'Lady Gaga',
            date: 'January 20, 2025',
            score: 5,
            comments: "While the landlord is friendly and understanding, communication could improve. I've had to follow up on repairs a few times, but they eventually got it done. They do a good job maintaining common areas and regularly schedule pest control."
        }
        // Add more rating objects here as needed
    ];

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
                            My Ratings <img src={Triangle} alt="Triangle" className={styles.this} />
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

                {/* Page Title */}
                <div className={styles["title-container"]}>
                    <img src={RatingsIcon} alt="Account" className={styles.titleicon} />
                    <h2>My Ratings</h2>
                </div>

                  {/* Ratings Boxes */}
                {ratings.map((rating, index) => (
                    <div key={index} className={styles["rating-container"]}>
                        <div className={styles["score-box"]}>
                            <span className={styles["rating-number"]}>{rating.score}</span>
                            <span className={styles["rating-total"]}>/ 5</span>
                        </div>

                        <div className={styles["rating-header"]}>
                            <div className={styles["rating-name"]}>{rating.name}</div>
                            <span className={styles["submitted-date"]}>{rating.date}</span>
                        </div>

                        <div className={styles["rating-comments"]}>
                            {rating.comments}
                        </div>

                        <div className={styles["rating-actions"]}>
                            <img src={EditIcon} alt="Edit" className={styles["action-icon"]} />
                            <img src={DeleteIcon} alt="Delete" className={styles["action-icon"]} />
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default MyRatings;
