import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MyRatings.module.css';

import Logo from '../Assets/logo.svg';
import HomeIcon from '../Assets/home.svg';
import SearchIcon from '../Assets/search.svg';
import AddLandlordIcon from '../Assets/add-a-landlord.svg';
import SignOutIcon from '../Assets/signout.svg';
import AccountIcon from '../Assets/my-account.svg';
import RatingsIcon from '../Assets/my-rate.svg';
import BookmarksIcon from '../Assets/my-book.svg';

import BackgroundLogo from '../Assets/rate-bg.svg';
import TopRightAddIcon from '../Assets/topright-add.svg';
import EditIcon from '../Assets/edit.svg';
import DeleteIcon from '../Assets/delete.svg';
import Triangle from '../Assets/triangle.svg';

import MyRatingsConfirmationModal from './MyRatingsConfirmationModal';


const MyRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [ratingToDelete, setRatingToDelete] = useState(null);
    const userId = 1; // Example user ID, replace with actual user ID when logged in

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/get_ratings', {
                    params: { userId }
                });
    
                if (response.status === 200) {
                    console.log("Fetched Ratings:", response.data); // Add this line
                    setRatings(response.data);
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };
    
        fetchRatings();
    }, [userId]);
    
    // Handle delete button click
    const handleDeleteClick = (ratingId) => {
        setRatingToDelete(ratingId);
        setShowModal(true);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (!ratingToDelete) return;

        try {
            const response = await axios.delete('http://localhost:5000/api/delete_rating', {
                params: { ratingId: ratingToDelete }
            });

            if (response.status === 200) {
                setRatings((prevRatings) => prevRatings.filter((rating) => rating._id !== ratingToDelete));
                //alert('Rating deleted successfully!');
            } else {
                //alert('Failed to delete rating.');
            }
        } catch (error) {
            console.error("Error deleting rating:", error);
            //alert('Failed to delete rating.');
        }
        setShowModal(false);
        setRatingToDelete(null);
    };

    // Cancel deletion
    const cancelDelete = () => {
        setShowModal(false);
        setRatingToDelete(null);
    };


    return (
        <div className={styles["my-account-container"]}>
            {/* Side Menu */}
            <aside className={styles["side-menu"]}>
                <div className={styles.logo}>
                    <img src={Logo} alt="Logo" />
                </div>
                <nav>
                    <ul>
                        <li><img src={HomeIcon} alt="Home" className={styles.icon} />Homepage</li>
                        <li><img src={SearchIcon} alt="Search" className={styles.icon} />Search</li>
                        <li><img src={AddLandlordIcon} alt="Add Landlord" className={styles.icon} />Add a Landlord</li>
                        <li><img src={SignOutIcon} alt="Sign Out" className={styles.icon} />Sign Out</li>
                    </ul>
                    <div style={{ margin: '50px 0' }}></div>
                    <ul>
                        <li><img src={AccountIcon} alt="Account" className={styles.icon} />My Account</li>
                        <li><img src={RatingsIcon} alt="Ratings" className={styles.icon} />My Ratings <img src={Triangle} alt="Triangle" className={styles.this} /></li>
                        <li><img src={BookmarksIcon} alt="Bookmarks" className={styles.icon} />My Bookmarks</li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
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
                    <img src={RatingsIcon} alt="Ratings" className={styles.titleicon} />
                    <h2>My Ratings</h2>
                </div>

                {/* Scrollable Ratings Section */}
                <div className={styles["ratings-scrollable"]}>
                    {ratings.map((rating, index) => (
                        <div key={index} className={styles["rating-container"]}>
                            <div className={styles["rating-header"]}>
                                <div className={styles["rating-name"]}>{rating.name}</div>
                                <div className={styles["score-box"]}>
                                    <span className={styles["rating-number"]}>{rating.score}</span>
                                    <span className={styles["rating-total"]}>/ 5</span>
                                </div>
                            </div>
                            <span className={styles["submitted-date"]}>
                                {new Date(rating.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>

                            <div className={styles["rating-comments"]}>{rating.comment}</div>
                            <div className={styles["rating-actions"]}>
                                <img src={EditIcon} alt="Edit" className={styles["action-icon"]} />
                                <img
                                src={DeleteIcon}
                                alt="Delete"
                                className={styles["action-icon"]}
                                onClick={() => handleDeleteClick(rating._id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Confirmation Modal */}
                {showModal && (
                    <MyRatingsConfirmationModal
                        message="Are you sure you want to delete this rating?"
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                    />
                )}
            </main>
        </div>
    );
};

export default MyRatings;
