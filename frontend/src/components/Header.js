import React from 'react';
import styles from './Header.module.css';
import PopUpMenu from './PopUpMenu';
import BarMenuIcon from '../Assets/menu-bar.svg';
import OfficialLogo from '../Assets/official logo.svg';
import SubmitLandlordRate from '../Assets/submit landlord rate.svg';
import AccountButton from '../Assets/Account button.svg';
import { useNavigate } from 'react-router-dom';

const Header = ({ isMenuOpen, toggleMenu }) => {
    const navigate = useNavigate();

    return (
        <>
            {/* Dimmed Background Overlay When Side Menu is Open */}
            {isMenuOpen && (
                <div className={styles.overlay} onClick={toggleMenu}></div>
            )}

            {/* Header Section */}
            <header className={styles.header}>
                {/* Pop-Up Menu */}
                <PopUpMenu isOpen={isMenuOpen} onClose={toggleMenu} />

                {/* Menu Button */}
                <button className={styles.menuButton} onClick={toggleMenu}>
                    <img src={BarMenuIcon} alt="Menu" className={styles.menuIcon} />
                </button>

                {/* Logo Section */}
                <div className={styles.logo}>
                    <img
                        src={OfficialLogo}
                        alt="Official Logo"
                        onClick={() => window.location.reload()}
                    />
                </div>

                {/* Buttons Container */}
                <div className={styles.buttonsContainer}>
                    <img
                        src={SubmitLandlordRate}
                        alt="Submit Landlord Rate"
                        className={styles.leftIcon}
                        onClick={() => navigate('/addalandlord')}
                    />
                    <img
                        src={AccountButton}
                        alt="Account Button"
                        className={styles.rightIcon}
                        onClick={() => navigate('/signin')}
                    />
                </div>
            </header>
        </>
    );
};

export default Header;
