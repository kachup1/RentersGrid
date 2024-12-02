import styles from './ReportProblemConfirmation.module.css';
import React, { useState, useEffect } from 'react';
import Header from './Header'
import OfficialLogo from '../Assets/official logo.svg';
import { useNavigate } from 'react-router-dom';

function ReportProblemConfirmation() {
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
        <div className={styles[`report-problem-confirmation-main-container`]}>
                
        <img src={OfficialLogo} alt="Official Logo" className={styles[`report-problem-confirmation-background-image`]} />

            <div className={styles[`report-problem-confirmation-wrapper`]}>
                <h1 className={styles[`report-problem-title`]}>Report a Problem</h1>
                <p className={styles[`report-problem-message`]}>
                    Thank you for bringing this to our attention. We will thoroughly investigate the matter.
                </p>
                <button
                    onClick={handleGoToMainPage}
                    className={styles[`report-problem-go-home-button`]}
                >
                    Go to main page
                </button>
            </div>

            
        </div>
        </div>
    );
}

export default ReportProblemConfirmation;
