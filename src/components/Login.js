// src/components/Login.js
import { useState } from "react";
import { useUser } from "../lib/context/user";
import './Login.css'; // Import CSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'; // Import Google and GitHub icons

export function Login() {
    const user = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState(""); // State for full name
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and register

    const handleLogin = () => {
        user.login(email, password);
    };

    const handleRegister = () => {
        user.register(email, password, fullName); // Pass fullName to register
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
                <p>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        className="toggle-button"
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Register" : "Login"}
                    </button>
                </p>
            </div>
        </section>
    );
}

export default Login;
