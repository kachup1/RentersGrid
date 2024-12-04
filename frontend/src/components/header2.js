import React from 'react';
import styles from './Header2.module.css';
import PopUpMenu from './PopUpMenu';
import BarMenuIcon from '../Assets/menu-bar.svg';
import OfficialLogo from '../Assets/official logo.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import AccountButton from '../Assets/Account button.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { isTokenValid } from './authentication';

const Header2 = ({ isMenuOpen, toggleMenu }) => {
    const navigate = useNavigate();
    const isSignedIn = isTokenValid();

    const location = useLocation();

    const handleLogoClick = () => {
        if (location.pathname === '/') {
            window.location.reload(); // Reload the page if in Homepage
        } else {
            navigate('/'); // Navigate to "/" if on another page
        }
    };

    return (
        <>
            {/* Dimmed Background Overlay When Side Menu is Open */}
            {isMenuOpen && (
                <div className={styles.overlay} onClick={toggleMenu}></div>
            )}

            {/* Header Section */}
            <header className={styles.header}>
                

               

                {/* Buttons Container */}
                <div className={styles.buttonsContainer}>
                    <img
                        src={SubmitLandlordRate}
                        alt="Submit Landlord Rate"
                        className={styles.leftIcon}
                        onClick={() => navigate('/addalandlord')}
                    />

                    <div className={styles.accountButtonWrapper}>
                        <img
                            src={AccountButton}
                            alt="Account Button"
                            className={styles.rightIcon}
                            onClick={() => {
                                if (isSignedIn) {
                                    navigate('/myaccount'); // Redirect to "My Account" if logged in
                                } else {
                                    navigate('/signin'); // Redirect to "Sign In" if not logged in
                                }
                            }}
                        />
                        {isSignedIn && (
                            <div className={styles.signedInIndicator} title="Signed In"></div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header2;
