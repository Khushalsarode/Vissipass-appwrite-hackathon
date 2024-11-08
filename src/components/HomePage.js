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
                    Welcome to the Visitor Pass Generation system. Quickly and easily generate visitor passes tailored to your needs. Secure, simple, and efficient.
                </p>
                <button className="open-form-button" onClick={openForm}>
                    Create Visitor Pass
                </button>
            </header>

            <main className="content">
                <section className="intro-section">
                    <h2>Why Choose Our System?</h2>
                    <p>
                        Our Visitor Pass Generation system is designed to be intuitive, fast, and secure. Whether you're organizing a business meeting, hosting an event, or managing guest visits, our system simplifies the process. Here's why our system stands out:
                    </p>
                    <ul>
                        <li>Fast and easy pass generation with minimal input</li>
                        <li>Customizable for various use cases (business meetings, events, guest visits)</li>
                        <li>Real-time tracking and management of generated passes</li>
                        <li>Secure data processing to protect visitor information</li>
                    </ul>
                </section>

                <section className="features-section">
                    <h2>Key Features</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h3>Customizable Passes</h3>
                            <p>Choose from a variety of templates and customize passes with specific details and branding.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Secure & Confidential</h3>
                            <p>All data is securely processed, ensuring that visitor information remains confidential.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Real-Time Monitoring</h3>
                            <p>Track the status of all generated passes and monitor visitor arrivals in real-time.</p>
                        </div>
                    </div>
                </section>


            </main>

            <footer className="footer">
                <div className="footer-info">
                    <p>&copy; {new Date().getFullYear()} Visitor Pass Generation. All Rights Reserved.</p>
                </div>
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
