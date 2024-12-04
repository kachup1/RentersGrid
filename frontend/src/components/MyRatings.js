import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MyRatings.module.css';
import { useNavigate } from 'react-router-dom';

import BackgroundLogo from '../Assets/rate-bg.svg';
import EditIcon from '../Assets/edit.svg';
import DeleteIcon from '../Assets/delete.svg';

import RatingsIcon from '../Assets/my-rate.svg';

import InsideAccountSideMenu from '../components/InsideAccountSideMenu';
import ConfirmationModal from './ConfirmationModal';

import RightButtons from './RightButtons';

const MyRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [ratingToDelete, setRatingToDelete] = useState(null);
    const totalRatings = ratings.length;


    // Initialize navigate
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchRatings = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token not found");
                window.location.href = '/';
                return;
            }
    
            try {
                const response = await axios.get('http://localhost:5000/api/get_ratings', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true // Allow sending cookies with the request
                });
                
                if (response.status === 200) {
                    setRatings(response.data);
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };
    
        fetchRatings();
    }, []);
    

    const handleEditClick = (landlordId, ratingId) => {
        if (landlordId && ratingId) {
            console.log(`Navigating to: /AddAReview/${landlordId}/${ratingId}`);
            navigate(`/AddAReview/${landlordId}/${ratingId}`);
        } else {
            console.error("userId or ratingId is missing");
        }
    };
    
    // Handle delete button click
    const handleDeleteClick = (objectId) => {
        setRatingToDelete(objectId);
        setShowModal(true);
    };
    

    // Confirm deletion
    const confirmDelete = async () => {
        if (!ratingToDelete) return;
    
        try {
            const response = await axios.delete('http://localhost:5000/api/delete_rating', {
                params: { object_id: ratingToDelete }
            });
    
            if (response.status === 200) {
                setRatings((prevRatings) => prevRatings.filter((rating) => rating.object_id !== ratingToDelete));
                
                // Refresh the page after successful deletion
                window.location.reload();
            }
        } catch (error) {
            console.error("Error deleting rating:", error);
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
        <div className={styles["my-container"]}>
            {/* Side Menu */}
            <InsideAccountSideMenu />
            {/* Main Content */}
            <main className={styles["main-content"]}>
                {/* Background logo */}
                <img src={BackgroundLogo} alt="Background Logo" className={styles["background-logo"]} />

                {/* Page Title */}
                <div className={styles["title-container"]}>
                    <img src={RatingsIcon} alt="Ratings" className={styles.titleicon} />
                    <h2>My Ratings</h2>
                </div>

                {/* Total Ratings */}
                <div className={styles["total-ratings"]}>
                    Total Ratings: <span className={styles["ratings-value"]}>{totalRatings}</span>
                    </div>
                <div className={styles["ratings-cards"]}>
                    {ratings.length === 0 ? (
                        <div className={styles["no-ratings-message"]}>You haven't added any ratings yet. Share your thoughts on your landlords!</div>
                    ) : (
                        ratings.map((rating, index) => (
                            <div key={index} className={styles["rating-container"]}>
                                <div className={styles["rating-header"]}>
                                    <div className={styles["rating-name"]}>{rating.landlord_name}</div>
                                    {/* Rating Box with coloring based on score */}
                                    <div className={`${styles["score-box"]} ${styles[`score-${rating.score}`]}`}>
                                        <span className={styles["rating-number"]}>{rating.score}</span>
                                        <span className={styles["rating-total"]}>/ 5</span>
                                    </div>

                                </div>
                                <span className={styles["submitted-date"]}>
                                    {new Date(rating.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                <div className={styles["rating-comments"]}>{rating.comment}</div>
                                <div className={styles["rating-actions"]}>
                                    <img
                                        src={EditIcon}
                                        alt="Edit"
                                        className={styles["action-icon"]}
                                        onClick={() => handleEditClick(rating.landlord_id, rating.rating_id)}
                                    />
                                    <img
                                        src={DeleteIcon}
                                        alt="Delete"
                                        className={styles["action-icon"]}
                                        onClick={() => handleDeleteClick(rating.object_id)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>


                {/* Confirmation Modal */}
                {showModal && (
                    <ConfirmationModal
                        message="Are you sure you want to delete this rating? This action cannot be undone."
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                    />
                )}
            </main>
             {/* Top-Right Icons */}
             <div className={styles["right-buttons"]}>
                    <RightButtons />
                </div>
        </div>
    );
};

export default MyRatings;