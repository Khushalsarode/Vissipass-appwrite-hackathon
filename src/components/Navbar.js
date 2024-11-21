import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useUser } from '../lib/context/user';
import { account, client } from '../lib/appwrite';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Avatars } from 'appwrite';
import logo from '../logo/logo2.png';

const Navbar = () => {
    const { isAuthenticated, userData, setIsAuthenticated } = useUser();
    const [showDropdown, setShowDropdown] = useState(false);
    //const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Track theme
    const navigate = useNavigate();
    const location = useLocation();

    const avatars = new Avatars(client);
    const result = avatars.getImage(
        'https://i.pinimg.com/originals/61/f7/5e/61f75ea9a680def2ed1c6929fe75aeee.jpg',
        30,
        30
    );

    
   {/* // Toggle theme function 
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save theme to localStorage
        document.body.className = newTheme; // Apply the theme to the body
    };
*/}
    const handleLogout = async () => {
        if (!isAuthenticated) {
            toast.info("Already logged out.");
            return;
        }

        try {
            await account.deleteSession('current');
            setIsAuthenticated(false);
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed: ' + error.message);
        }
    };

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleLinkClick = (path) => {
        if (location.pathname === path) {
            navigate(0);
        } else {
            navigate(path);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                    <div className='info'>
                        <h1 className="project-name">VISSIPASS</h1>
                        <p className="tagline">Your Easy Path to a Civilized Visitor Management Experience!</p>
                    </div>
                </div>
                <ul className="nav-menu">
                    {isAuthenticated ? (
                        <>
                            <li><Link to="/dashboard" onClick={() => handleLinkClick('/dashboard')}>Dashboard</Link></li>
                            <li><Link to="/record-list" onClick={() => handleLinkClick('/record-list')}>Review Pass</Link></li>
                            <li><Link to="/generate-pass" onClick={() => handleLinkClick('/generate-pass')}>Generate Pass</Link></li>
                            <li><Link to="/generated-pass" onClick={() => handleLinkClick('/generated-pass')}>Current Holdings</Link></li>
                            <li><Link to="/verify-pass" onClick={() => handleLinkClick('/verify-pass')}>Verify Record</Link></li>
                            <li><Link to="/archive" onClick={() => handleLinkClick('/archive')}>Archive</Link></li>
                            <li className="profile-section">
                                <FontAwesomeIcon 
                                    icon={faUser} 
                                    className="profile-icon"
                                    onClick={toggleDropdown}
                                    style={{ cursor: 'pointer' }}
                                />
                                {showDropdown && (
                                    <div className="profile-dropdown">
                                        <p><img src={result} alt="User Avatar" className="user-avatar" /> Logged in User:</p>
                                        <p>Access Level: <strong>Admin</strong></p>
                                        <p>Username: <strong>{userData.name}</strong></p>
                                        <p>Email: <strong>{userData.email}</strong></p>
                                        <button onClick={handleLogout} className="logout-button">Logout</button>
                                    </div>
                                )}
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/" onClick={() => handleLinkClick('/')}>Home</Link></li>
                            <li><Link to="/about" onClick={() => handleLinkClick('/about')}>About</Link></li>
                            <li><Link to="/login" onClick={() => handleLinkClick('/login')}>Login/Register</Link></li>
                            <li><Link to="/verify-pass" onClick={() => handleLinkClick('/verify-pass')}>Verify Record</Link></li>
                        </>
                    )}
                    {/* Theme toggle button 
                    <li>
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {theme === 'light' ? '🌙' : '🌞'}
                        </button>
                    </li>
                    */}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
