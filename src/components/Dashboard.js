// src/components/Dashboard.js

import React from 'react';
import { useUser } from '../lib/context/user';
import './Dashboard.css'; // Import CSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHistory, faCog } from '@fortawesome/free-solid-svg-icons'; // Import relevant icons

const Dashboard = () => {
    const { isAuthenticated, userData } = useUser(); // Assuming userData is available

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Welcome to Your Dashboard</h1>
                {isAuthenticated && (
                    <p className="welcome-message">
                        Hello, <strong>{userData.username}</strong>! You are logged in. 
                        Here you can view and manage your activities.
                    </p>
                )}
            </header>
            <div className="dashboard-content">
                <section className="dashboard-section profile-overview">
                    <h2><FontAwesomeIcon icon={faUser} /> Your Profile Overview</h2>
                    <p>This section will display a quick overview of your profile.</p>
                </section>
                <section className="dashboard-section recent-activity">
                    <h2><FontAwesomeIcon icon={faHistory} /> Recent Activity</h2>
                    <p>This section will show your most recent actions and updates.</p>
                </section>
                <section className="dashboard-section settings">
                    <h2><FontAwesomeIcon icon={faCog} /> Settings</h2>
                    <p>Adjust your account settings and preferences here.</p>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
