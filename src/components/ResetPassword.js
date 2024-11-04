import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Assuming you're using React Router
import { Client, Account } from "appwrite";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ResetPassword.css'; // Import CSS for styling

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT) // Your Appwrite endpoint
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID); // Your Appwrite project ID

const account = new Account(client);

export function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Extract userId and secret from the query parameters
    const query = new URLSearchParams(location.search);
    const userId = query.get("userId");
    const secret = query.get("secret");

    useEffect(() => {
        if (!userId || !secret) {
            toast.error("Invalid or missing reset link parameters.");
            navigate("/forgot-password"); // Redirect if no parameters
        }
    }, [userId, secret, navigate]);

    const handleResetPassword = async () => {
        if (!password || password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await account.updateRecovery(userId, secret, password);
            toast.success("Password reset successfully. Please log in with your new password.");
            navigate("/login"); // Redirect to login after success
        } catch (error) {
            console.error("Failed to reset password", error.message);
            toast.error("Failed to reset password: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <p>Enter your new password below.</p>
            <div className="input-container">
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                />
            </div>
            <button onClick={handleResetPassword} disabled={loading} className="reset-button">
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </div>
    );
}

export default ResetPassword;
