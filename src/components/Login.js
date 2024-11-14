import { useState } from "react";
import { useUser } from "../lib/context/user";
import { ForgotPassword } from "./ForgotPassword";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

export function Login() {
    const user = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleLogin = () => {
        user.login(email, password);
    };

    const handleRegister = async () => {
        try {
            await user.register(email, password, fullName);
            toast.info('Registration successful! Please check your email to verify your account.');
            await user.sendVerificationEmail();
        } catch (error) {
            console.error("Registration failed", error.message);
            toast.error('Registration failed: ' + error.message);
        }
    };

    return (
        <div>
        <section className="auth-container">
            <div className="auth-card">
                {showForgotPassword ? (
                    <ForgotPassword onBack={() => setShowForgotPassword(false)} />
                ) : (
                    <>
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
                                    className="oauth-button google-button"
                                    type="button"
                                    onClick={user.loginWithGoogle}
                                >    &nbsp; 
                                    <FontAwesomeIcon icon={faGoogle} style={{ marginRight: "8px" }} />
                                    {isLogin ? "Login" : "Register"} with Google
                                </button>
                                <button
                                    className="oauth-button github-button"
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
                            <a
                                className="toggle-link"
                                href="#"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? "Register" : "Login"}
                            </a>
                        </p>
                        {isLogin && (
                            <p style={{ margin: '0', padding: '0' }}>
                                <a
                                    className="toggle-link"
                                    href="#"
                                    onClick={() => setShowForgotPassword(true)}
                                >
                                    Forgot Password?
                                </a>
                            </p>
                        )}
                    </>
                )}
            </div>
           
        </section>
         <div className="auth-footer">
         <footer className="verify-pass-footer">
             <p>&copy; {new Date().getFullYear()} Visitor Pass Generation. All Rights Reserved.</p>
         </footer>
         </div>
         </div>
    );
}

export default Login;
