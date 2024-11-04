import { useState, useEffect } from "react";
import { Client, Account } from "appwrite";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css';

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

const account = new Account(client);

export function ForgotPassword({ onBack }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false); // Track success for delay reset

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email.");
            return;
        }

        setLoading(true);
        try {
            await account.createRecovery(
                email,
                "http://localhost:3000/reset-password" // URL for password reset confirmation
            );
            toast.success("Password reset email sent. Please check your inbox.");
            setEmail("");
            setSuccess(true); // Trigger reset back to login
        } catch (error) {
            console.error("Failed to send password reset email", error.message);
            toast.error("Failed to send password reset email: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false); // Reset success state
                onBack(); // Call onBack to switch back to login view
            }, 2000); // Delay to give time for user to see the message
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, [success, onBack]);

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a password reset link.</p>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
            />
            <button onClick={handleForgotPassword} disabled={loading}>
                {loading ? "Sending..." : "Send Password Reset Email"}
            </button>
            <button onClick={onBack} className="back-button">
                Back to Login
            </button>
        </div>
    );
}

export default ForgotPassword;
