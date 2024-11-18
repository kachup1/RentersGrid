import React from 'react';
import styles from './InsideAccountSideMenu.module.css';
import { Link, useLocation } from 'react-router-dom';

import Logo from '../Assets/logo.svg';
import HomeIcon from '../Assets/home.svg';
import SearchIcon from '../Assets/search.svg';
import AddLandlordIcon from '../Assets/add-a-landlord.svg';
import SignOutIcon from '../Assets/signout.svg';
import AccountIcon from '../Assets/my-account.svg';
import RatingsIcon from '../Assets/my-rate.svg';
import BookmarksIcon from '../Assets/my-book.svg';
import Triangle from '../Assets/triangle.svg';

const InsideAccountSideMenu = () => {
    const location = useLocation();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const isActive = (path) => location.pathname === path;

    const handleRefresh = (path) => {
        if (isActive(path)) {
            window.location.reload();
        }
    };

    return (
        <aside className={styles["side-menu"]}>
            <div className={styles.logo}>
                <img src={Logo} alt="Logo" />
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/" onClick={() => handleRefresh('/')}>
                            <img src={HomeIcon} alt="Home" className={styles.icon} />
                            Homepage
                            {isActive('/') && <img src={Triangle} alt="Triangle" className={styles.this} />}
                        </Link>
                    </li>
                    <li>
                        <Link to="/searchresults" onClick={() => handleRefresh('/searchresults')}>
                            <img src={SearchIcon} alt="Search" className={styles.icon} />
                            Search
                            {isActive('/searchresults') && <img src={Triangle} alt="Triangle" className={styles.this} />}
                        </Link>
                    </li>
                    <li>
                        <Link to="/AddALandlord" onClick={() => handleRefresh('/AddALandlord')}>
                            <img src={AddLandlordIcon} alt="Add Landlord" className={styles.icon} />
                            Add a Landlord
                            {isActive('/AddALandlord') && <img src={Triangle} alt="Triangle" className={styles.this} />}
                        </Link>
                    </li>
                    <li onClick={handleSignOut}>
                        <a href="/">
                            <img src={SignOutIcon} alt="Sign Out" className={styles.icon} />
                            Sign Out
                        </a>
                    </li>
                </ul>
                <div style={{ margin: '50px 0' }}></div>
                <ul>
                    <li>
                        <a href="/myaccount" onClick={() => handleRefresh('/myaccount')}>
                            <img src={AccountIcon} alt="Account" className={styles.icon} />
                            My Account
                            {isActive('/myaccount') && <img src={Triangle} alt="Triangle" className={styles.this} />}
                        </a>
                    </li>
                    <li>
                        <Link to="/myratings" onClick={() => handleRefresh('/myratings')}>
                            <img src={RatingsIcon} alt="Ratings" className={styles.icon} />
                            My Ratings
                            {isActive('/myratings') && <img src={Triangle} alt="Triangle" className={styles.this} />}
                        </Link>
                    </li>
                    <li>
                        <Link to="/bookmarks" onClick={() => handleRefresh('/bookmarks')}>
                            <img src={BookmarksIcon} alt="Bookmarks" className={styles.icon} />
                            My Bookmarks
                            {isActive('/bookmarks') && <img src={Triangle} alt="Triangle" className={styles.this} />}
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default InsideAccountSideMenu;
