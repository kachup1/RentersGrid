import React, { useState } from 'react';
import styles from './Test.module.css';
import Header from './Header';


const Test = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle the menu open/close
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={styles.testContainer}>
            {/* Header component */}
            <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </div>
    );
};

export default Test;
