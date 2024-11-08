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

                {/* Terms and Conditions Section */}
                <section className="info-section">
                    <h2>Terms and Conditions</h2>
                    <p>By using our service, you agree to the following terms and conditions:</p>
                    <ul>
                        <li>We provide visitor pass generation services for businesses and organizations.</li>
                        <li>The passes generated are valid only within the confines of the organization’s premises.</li>
                        <li>All personal data collected through the service is stored securely and used strictly for visitor management purposes.</li>
                        <li>Visitors must present their generated passes upon entry to the premises.</li>
                        <li>We reserve the right to modify or terminate the service at any time without prior notice.</li>
                    </ul>
                    <p>
                        For more details, please refer to our <a href="/privacy-policy" className="link">Privacy Policy</a> and <a href="/support" className="link">Support</a>.
                    </p>
                </section>
            </main>
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Visitor Pass Generation. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default AboutPage;
