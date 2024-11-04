import { useState } from "react";
import { useUser } from "../lib/context/user";
import './Login.css'; // Import CSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'; // Import Google and GitHub icons
import { toast } from 'react-toastify'; // Import toast module  

export function Login() {
    const user = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState(""); // State for full name
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
    const [message, setMessage] = useState(""); // State to show messages to the user

    const handleLogin = () => {
        user.login(email, password);
    };

    const handleRegister = async () => {
        try {
            await user.register(email, password, fullName); // Pass fullName to register
            toast.info('Registration successful! Please check your email to verify your account.'); // Display toast message
            // Send verification email
            await user.sendVerificationEmail(); // Ensure sendVerificationEmail() is defined in your user context
        } catch (error) {
            console.error("Registration failed", error.message);
            toast.error('Registration failed: ' + error.message); // Display toast message
        }
    };

    return (
        <section className="auth-container">
            <div className="auth-card">
                <h1>{isLogin ? "Login" : "Register"}</h1>
                <form>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    <div className="button-group">
                        <button
                            className="button"
                            type="button"
                            onClick={isLogin ? handleLogin : handleRegister}
                        >
                            {isLogin ? "Login" : "Register"}
                        </button>
                    </div>
                    <div className="oauth-buttons">
                        <button
                            className="oauth-button"
                            type="button"
                            onClick={user.loginWithGoogle}
                        >
                            <FontAwesomeIcon icon={faGoogle} style={{ marginRight: "8px" }} />
                            {isLogin ? "Login" : "Register"} with Google
                        </button>
                        <button
                            className="oauth-button"
                            type="button"
                            onClick={user.loginWithGitHub}
                        >
                            <FontAwesomeIcon icon={faGithub} style={{ marginRight: "8px" }} />
                            {isLogin ? "Login" : "Register"} with GitHub
                        </button>
                    </div>
                </form>
                <p className="message">{message}</p> {/* Display message to the user */}
                <p>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <a
                        className="toggle-link"
                        href="#"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setMessage(""); // Clear message when toggling between login/register
                        }}
                    >
                        {isLogin ? "Register" : "Login"}
                    </a>
                </p>
                {isLogin && (
                    <p style={{ margin: '0', padding: '0' }}>
                        <a
                            className="toggle-link"
                            href="#"
                            onClick={() => toast.info("Functionality to reset password is not implemented yet.")}
                        >
                            Forgot Password?
                        </a>
                    </p>
                )}
            </div>
        </section>
    );
}

export default Login;
