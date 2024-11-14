// src/components/HomePage.js

import React, { useState } from 'react';
import VisitorPassForm from './VisitorPassForm';
import './HomePage.css';

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
                <div className="header-content">
                    <h1 className="header-title">VISSIPASS</h1>
                    <p className="header-tagline">Your All-in-One Visitor Pass Solution</p>
                    <p className="header-description">
                        Simplifying visitor management for schools, colleges, businesses, and organizations with secure and efficient pass generation, real-time tracking, and customizable templates.
                    </p>
                    <button className="create-pass-button" onClick={openForm}>
                        Create Visitor Pass
                    </button>
                </div>
            </header>

            <main className="content">
                <section className="features-section">
                    <h2 className="section-title">Why Choose VISSIPASS?</h2>
                    <p className="section-description">
                        VISSIPASS is designed for seamless visitor management, offering customizable, secure, and user-friendly features tailored to fit any organization’s needs.
                    </p>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h3>Customizable Pass Templates</h3>
                            <p>Design and personalize visitor passes to align with your organization's branding and requirements.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Real-Time Tracking</h3>
                            <p>Monitor visitor entries in real time for enhanced security and streamlined access management.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Secure & Compliant</h3>
                            <p>Our system ensures data confidentiality, storing all visitor information securely and in compliance with data regulations.</p>
                        </div>
                    </div>
                </section>

                <section className="how-it-works-section">
                    <h2 className="section-title">How It Works</h2>
                    <ul className="steps-list">
                        <li>Request a pass by filling out the visitor form with necessary details.</li>
                        <li>The request is reviewed and approved by the system operator.</li>
                        <li>Once approved, the visitor pass is sent directly to the user’s email.</li>
                        <li>Scan the pass upon arrival for easy check-in and secure access.</li>
                    </ul>
                </section>
            </main>

            <footer className="footer">
                <p className="footer-text">&copy; {new Date().getFullYear()} VISSIPASS. All Rights Reserved.</p>
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
