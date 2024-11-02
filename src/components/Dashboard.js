// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useUser } from '../lib/context/user';
import { account } from '../lib/appwrite';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHistory, faCog } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const { isAuthenticated, userData } = useUser(); 
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        profilePicture: '',
        createdAt: '',
        location: '',
        lastPasswordChange: ''
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [verificationStatus, setVerificationStatus] = useState('Pending');

    useEffect(() => {
        document.body.className = theme;
        // Fetch user profile information
        if (isAuthenticated) {
            // Fetch user profile data
            const fetchProfile = async () => {
                const userDetails = await account.get();
                setProfile({
                    username: userDetails.name,
                    email: userDetails.email,
                    profilePicture: userDetails.profilePicture || '', // Replace with actual field if available
                    createdAt: new Date(userDetails.registration).toLocaleDateString(),
                    location: userDetails.location || 'Not set',
                    lastPasswordChange: userDetails.passwordUpdate ? new Date(userDetails.passwordUpdate).toLocaleDateString() : 'Never'
                });
            };

            // Fetch recent activity
            const fetchRecentActivity = async () => {
                // Assuming there’s a function or endpoint to get recent logins/logouts
               // const activityData = await account.getLogs(); // Replace with actual activity fetch method
               // setRecentActivity(activityData.logs || []);
            };

            fetchProfile();
            fetchRecentActivity();
        }
    }, [theme, isAuthenticated]);

    // Toggle Theme
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.body.className = newTheme;
        toast.info(`Theme switched to ${newTheme}`, { autoClose: 2000 });
    };

    // Verification Handler (Placeholder)
    const handleVerification = () => {
        // Placeholder: Replace with email OTP verification functionality
        toast.info("Verification OTP sent to your email.");
    };

    // Change Password Handler
    const handleChangePassword = () => {
        // Placeholder for actual password change function
        toast.success("Password changed successfully.");
    };

    const handleClearCache = () => {
        // Placeholder for actual cache clearing function
        toast.success("Cache cleared successfully.");
    };
    const handleDeleteData = () => {
        // Placeholder for actual data deletion function
        toast.success("Data deleted successfully.");
    };  
    const handleDeleteAccount = () => {
        // Placeholder for actual account deletion function
        toast.success("Account deleted successfully.");         
    };



    return (
        <div className="dashboard">
            <ToastContainer />
            <header className="dashboard-header">
                <h1>Welcome to Your Dashboard</h1>
                {isAuthenticated && (
                    <p className="welcome-message">
                        Hello, <strong>{profile.username}</strong>! You are logged in. 
                        Here you can view and manage your activities.
                    </p>
                )}
            </header>
            <div className="dashboard-content">
                {/* Profile Overview Section */}
                <section className="dashboard-section profile-overview">
                    <h2><FontAwesomeIcon icon={faUser} /> Profile Overview</h2>
                    <p>Username: {profile.username}</p>
                    <p>Email: {profile.email}</p>
                    <p>Member Since: {profile.createdAt}</p>
                    <p>Location: {profile.location}</p>
                    <img src={profile.profilePicture} alt="Profile" className="profile-picture" />
                </section>

                {/* Recent Activity Section */}
                <section className="dashboard-section recent-activity">
                    <h2><FontAwesomeIcon icon={faHistory} /> Recent Activity</h2>
                    <ul>
                        {recentActivity.map((activity, index) => (
                            <li key={index}>
                                {activity.event}: {new Date(activity.date).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                    <h3>Account Verification Status</h3>
                    <p>Status: {verificationStatus}</p>
                    <button onClick={handleVerification}>Send OTP</button>
                </section>
                
                {/* Settings Section */}
                <section className="dashboard-section settings">
                    <h2><FontAwesomeIcon icon={faCog} /> Settings</h2>
                    <div className="settings-options">
                        {/* Theme Toggle */}
                        <div>
                            <label>Theme: </label>
                            <button onClick={toggleTheme} className="toggle-theme">
                                {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                            </button>
                        </div>

                        {/* Last Password Change */}
                        <p>Last Password Change: {profile.lastPasswordChange}</p>
                        <button onClick={handleChangePassword}>Change Password</button>

                        {/* Clear Cache */}
                        <button onClick={handleClearCache} className="clear-cache">Clear Cache</button>

                        {/* Delete Data */}
                        <button onClick={handleDeleteData} className="delete-data">Delete Data</button>

                        {/* Delete Account */}
                        <button onClick={handleDeleteAccount} className="delete-account">Delete Account</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
