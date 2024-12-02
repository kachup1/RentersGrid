import React, { useState, useEffect } from 'react';
import styles from './ReportReviewConfirmation.module.css';
import Header from './Header'
import OfficialLogo from '../Assets/official logo.svg';
import { useNavigate } from 'react-router-dom';

function ReportReviewConfirmation() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleGoToMainPage = () => {
        navigate('/');
    };

    return (
        <div className={styles[`parent`]}>
            <div className="Header">
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
        <div className={styles[`report-review-confirmation-main-container`]}>
                <div className={styles[`report-review-confirmation-logo-container`]}>
                    <a href="/">
                        <img src={OfficialLogo} alt="Official Logo" className={styles[`report-review-confirmation-background-image`]} />
                    </a>
                </div>

                {/* Background Image */}
            <div className={styles[`report-review-confirmation-wrapper`]}>
                <h1 className={styles[`report-review-title`]}>Report a Review</h1>
                <p className={styles[`report-review-message`]}>
                    Thank you for bringing this to our attention. We will thoroughly investigate the matter.
                </p>
                <button
                    onClick={handleGoToMainPage}
                    className={styles[`report-review-go-home-button`]}
                >
                    Go to main page
                </button>
            </div>
            </div>
            </div>
           
    );
}

export default ReportReviewConfirmation;
