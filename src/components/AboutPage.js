// src/components/AboutPage.js

import React from 'react';
import './AboutPage.css'; // For styles

const AboutPage = () => {
    return (
        <div className="aboutpage">
            <header className="header">
                <h1>About Visitor Pass Generation</h1>
                <p className="header-description">
                    Your trusted solution for efficient visitor management.
                </p>
            </header>
            <main className="content">
                <section className="info-section">
                    <h2>Our Mission</h2>
                    <p>
                        At Visitor Pass Generation, our mission is to streamline the process of creating visitor passes for businesses and organizations. We understand the importance of security and efficiency in managing guest access.
                    </p>
                </section>

                <section className="info-section">
                    <h2>Why Choose Us?</h2>
                    <p>
                        Our system offers numerous benefits, including user-friendly interfaces and customizable passes to fit your organization’s needs.
                    </p>
                </section>

                <section className="info-section">
                    <h2>Our Features</h2>
                    <ul>
                        <li>Customizable Pass Templates</li>
                        <li>Real-Time Tracking of Visitor Data</li>
                        <li>Secure and Compliant Access Management</li>
                        <li>User-Friendly Interface</li>
                        <li>24/7 Customer Support</li>
                    </ul>
                </section>
            </main>
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Visitor Pass Generation. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default AboutPage;
