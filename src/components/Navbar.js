// src/components/Navbar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useUser } from '../lib/context/user';
import { account, client} from '../lib/appwrite';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import the user icon
import { Avatars } from "appwrite";

const Navbar = () => {
    const { isAuthenticated, userData, setIsAuthenticated } = useUser();
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
  { /* 
    //user profile icon code   
    
    const result = avatars.getFavicon(
        'url' // url
    );
    
*/ }
        const avatars = new Avatars(client);

        const result = avatars.getImage(
            'https://i.pinimg.com/originals/61/f7/5e/61f75ea9a680def2ed1c6929fe75aeee.jpg', // url
            30, // width (optional)
            30 // height (optional)
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

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <h1 className="project-name">Visitor Pass Generation</h1>
                <p className="tagline">Your easy solution for visitor management</p>
                <ul className="nav-menu">
                    {isAuthenticated ? (
                        <>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/record-list">Review Pass</Link></li>
                            <li><Link to="/generate-pass">Generate Pass</Link></li>
                            <li><Link to="/generated-pass">Current Holdings</Link></li>
                            <li><Link to="/record-checker">Active Pass</Link></li>
                            <li className="profile-section">
                                <FontAwesomeIcon 
                                    icon={faUser} // Use the user icon
                                    className="profile-icon"
                                    onClick={toggleDropdown}
                                    style={{ cursor: 'pointer' }} // Add a pointer cursor for clickability
                                />
                                {showDropdown && (
                                    <div className="profile-dropdown">
                                        <p> <img src={result} alt="User Avatar" className="user-avatar" />  Logged in User:</p>
                                       {/*  //user profile icon code in popup */}
                                        <p>Access Level: <strong>Admin</strong></p> {/* Added access level */}
                                        <p>Username: <strong>{userData.name}</strong></p> {/* Added username */}
                                        <p>Email: <strong>{userData.email}</strong></p>
                                        <button onClick={handleLogout} className="logout-button">Logout</button>
                                    </div>
                                )}
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            {/* <li><Link to="/register">Register</Link></li> */}
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
