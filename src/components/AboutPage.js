// src/components/AboutUs.js

import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-us-page">
            <header className="about-us-header">
                <h1>About VissiPass</h1>
                <p className="about-us-intro">
                    VissiPass is your all-in-one visitor management solution for schools, colleges, businesses, and organizations. Our platform streamlines visitor tracking, data management, and security, all tailored to fit your organization’s needs.
                </p>
            </header>

            <section className="about-us-mission">
                <h2>Our Mission</h2>
                <p>
                    At VissiPass, we aim to provide a secure, user-friendly platform that caters to modern organizational needs. We prioritize data security, customizable visitor passes, and efficient visitor tracking in real time.
                </p>
            </section>

            <section className="about-us-features">
                <h2>Why Choose VissiPass?</h2>
                <ul className="features-list">
                    <li><strong>Customizable Pass Templates:</strong> Tailor visitor passes with specific branding and access details.</li>
                    <li><strong>Real-Time Tracking:</strong> Monitor visitor check-ins and check-outs effortlessly.</li>
                    <li><strong>Secure and Confidential:</strong> All data is securely managed, ensuring visitor information remains confidential.</li>
                    <li><strong>User-Friendly Interface:</strong> A simple, intuitive interface makes visitor management easy.</li>
                </ul>
            </section>

            <section className="about-us-privacy">
                <h2>Privacy & Data Security</h2>
                <p>
                    We take privacy seriously. All personal data collected is securely stored and used solely for visitor management purposes. VissiPass follows industry-standard security practices to safeguard visitor information.
                </p>
                <p>
                    Our passes are valid only within your organization’s premises, ensuring data is handled responsibly and confidentially.
                </p>
            </section>
           
            <div>
             <footer className="about-us-footer">
                <p>&copy; {new Date().getFullYear()} VissiPass. All Rights Reserved. | <a href="/privacy-policy">Privacy Policy</a></p>
            </footer>
        </div>
        
        </div>

       
    );
};

export default AboutPage;
