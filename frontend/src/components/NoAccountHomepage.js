import React, { useState } from 'react';

import AllLocationsMap from './AllLocationsMap';
import Header from './Header';
import SearchButton from './MainSearchButton';

import styles from './NoAccountHomepage.module.css';


function NoAccountHomePage() {

    // State for side menu if it's open
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Function to toggle the menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    // Define the handleSearch function
    const handleSearch = (query) => {
        console.log(`Searching for: ${query}`);
        // You can add additional logic for handling the search
    };

  
    return (
        <div className="main-container">
            {/* Header Section */}
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

            {/* Search Button Section */}
            <div className={styles.searchContainer}>
                <SearchButton onSearch={handleSearch} />
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