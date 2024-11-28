import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AllLocationsMap from './AllLocationsMap';
import Header from './Header';
import MainSearchButton from './MainSearchButton';

import styles from './NoAccountHomepage.module.css';

function NoAccountHomePage() {
    // State for side menu if it's open
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Initialize navigate for redirection
    const navigate = useNavigate();

    // Function to toggle the menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="main-container">
            {/* Header Section */}
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

            {/* Search Button Section */}
            <div className={styles.searchContainer}>
                <MainSearchButton
                    onSearch={(data, query, searchBy) => {
                        navigate('/SearchResults', { state: { results: data, searchQuery: query, searchBy } });
                    }}
                />
            </div>

            <section className="map-section">
                <div className="map-container">
                    <AllLocationsMap />
                </div>
            </section>
        </div>
    );
}

export default NoAccountHomePage;
