import React, { useEffect } from 'react';
import { account } from '../lib/appwrite'; // Adjust the path as necessary
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Verify.css'; // Import CSS for styling

const Verify = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId');
            const secret = urlParams.get('secret');
          
            if (userId && secret) {
                try {
                    await account.updateVerification(userId, secret);
                    toast.success("Your email has been verified successfully.");
                    navigate('/dashboard'); // Redirect after successful verification
                } catch (error) {
                    toast.error("Verification failed. Please try again.");
                    console.error("Verification update error:", error);
                    navigate('/'); // Redirect to home on failure
                }
            } else {
                toast.error("Invalid verification link.");
            }
        };

        verifyUser();
    }, [navigate]);

    return (
        <div className="verify-container">
            <div className="verify-card">
                <h2>Email Verification</h2>
                <p>Please wait while we verify your email...</p>
                <div className="spinner"></div> {/* Add spinner */}
            </div>
        </div>
    );
};

export default Verify;
