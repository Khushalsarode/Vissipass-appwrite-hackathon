// src/components/Navbar.js

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useUser } from '../lib/context/user';
import { account, client } from '../lib/appwrite';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Avatars } from "appwrite";
import logo from '../logo/favicon12.png';

const Navbar = () => {
    const { isAuthenticated, userData, setIsAuthenticated } = useUser();
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const avatars = new Avatars(client);
    const result = avatars.getImage(
        'https://i.pinimg.com/originals/61/f7/5e/61f75ea9a680def2ed1c6929fe75aeee.jpg',
        30,
        30
    );

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

    // Custom handle click to refresh page if already on it
    const handleLinkClick = (path) => {
        if (location.pathname === path) {
            navigate(0);  // Refresh the page if already on the same route
        } else {
            navigate(path);  // Navigate to the new path
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
            <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <h1 className="project-name">VISSIPASS</h1>
                <p className="tagline">Your Easy Path to a Civilized Visitor Management Experience!</p>
                <ul className="nav-menu">
                    {isAuthenticated ? (
                        <>
                            <li onClick={() => handleLinkClick('/dashboard')}><Link to="/dashboard">Dashboard</Link></li>
                            <li onClick={() => handleLinkClick('/record-list')}><Link to="/record-list">Review Pass</Link></li>
                            <li onClick={() => handleLinkClick('/generate-pass')}><Link to="/generate-pass">Generate Pass</Link></li>
                            <li onClick={() => handleLinkClick('/generated-pass')}><Link to="/generated-pass">Current Holdings</Link></li>
                            <li onClick={() => handleLinkClick('/verify-pass')}><Link to="/verify-pass">Verify Record</Link></li>
                            <li onClick={() => handleLinkClick('/archive')}><Link to="/archive">Archive</Link></li>
                            <li className="profile-section">
                                <FontAwesomeIcon 
                                    icon={faUser} 
                                    className="profile-icon"
                                    onClick={toggleDropdown}
                                    style={{ cursor: 'pointer' }}
                                />
                                {showDropdown && (
                                    <div className="profile-dropdown">
                                        <p><img src={result} alt="User Avatar" className="user-avatar" />  Logged in User:</p>
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
                            <li onClick={() => handleLinkClick('/')}><Link to="/">Home</Link></li>
                            <li onClick={() => handleLinkClick('/about')}><Link to="/about">About</Link></li>
                            <li onClick={() => handleLinkClick('/login')}><Link to="/login">Login/Register</Link></li>
                            <li onClick={() => handleLinkClick('/verify-pass')}><Link to="/verify-pass">Verify Record</Link></li>
                           {/*  <li onClick={() => handleLinkClick('/reset-password')}><Link to="/reset-password">Reset Password</Link></li> */}
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
