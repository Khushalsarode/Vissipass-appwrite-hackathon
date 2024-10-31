// src/components/HomePage.js

import React, { useState } from 'react';
import VisitorPassForm from './VisitorPassForm';
import './HomePage.css'; // For styles

const HomePage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    return (
        <div className="homepage">
            <header className="header">
                <h1 className="header-title">Visitor Pass Generation</h1>
                <p className="header-description">
                    Welcome to the Visitor Pass Generation system. Easily generate visitor passes tailored to your needs.
                </p>
                <button className="open-form-button" onClick={openForm}>
                    Create Visitor Pass
                </button>
            </header>

            <main className="content">
                <section className="info-section">
                    <h2>About the System</h2>
                    <p>
                        Our system simplifies the process of generating visitor passes. You can create passes for various purposes including:
                    </p>
                    <ul>
                        <li>Business Meetings</li>
                        <li>Events and Conferences</li>
                        <li>Guest Visits</li>
                    </ul>
                    <p>
                        Follow the instructions, and your visitor pass will be ready in no time!
                    </p>
                </section>
            </main>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Visitor Pass Generation. All Rights Reserved.</p>
            </footer>

            {isFormOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeForm}>&times;</button>
                        <VisitorPassForm />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
