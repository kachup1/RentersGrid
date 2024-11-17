import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MyRatings.module.css';

import BackgroundLogo from '../Assets/rate-bg.svg';
import TopRightAddIcon from '../Assets/topright-add.svg';
import EditIcon from '../Assets/edit.svg';
import DeleteIcon from '../Assets/delete.svg';

import AccountIcon from '../Assets/my-account.svg';
import RatingsIcon from '../Assets/my-rate.svg';

import InsideAccountSideMenu from '../components/InsideAccountSideMenu';

import MyRatingsConfirmationModal from './MyRatingsConfirmationModal';


const MyRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [ratingToDelete, setRatingToDelete] = useState(null);
    const userId = 1; // Example user ID, replace with actual user ID when logged in

    useEffect(() => {
        // IF NOT SIGNED IN IT WILL REDIRECT TO HOMEPAGE
        const token = localStorage.getItem('token'); // Get the token from localStorage
        // Redirect to homepage if token is missing
        if (!token) {
            window.location.href = '/';
            return;
        }

        const fetchRatings = async () => {
            const token = localStorage.getItem('token'); // Get token from localStorage
            if (!token) {
                console.error("No token found");
                return;
            }
    
            try {
                const response = await axios.get('http://localhost:5000/api/get_ratings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                if (response.status === 200) {
                    console.log("Fetched Ratings:", response.data);
                    setRatings(response.data);
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };
    
        fetchRatings();
    }, []);
    
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
            <InsideAccountSideMenu />
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
                    {ratings.length === 0 ? (
                        // Show this message when there are no ratings
                        <div className={styles["no-ratings-message"]}>
                            You Haven't Rated Anyone Yet
                        </div>
                    ) : (
                        ratings.map((rating, index) => (
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
                        ))
                    )}
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
