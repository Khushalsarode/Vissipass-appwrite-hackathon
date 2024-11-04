// src/lib/context/user.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { account, ID } from '../appwrite';
import { toast } from 'react-toastify';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
   

    // Check if the user is authenticated and fetch user data
    const checkAuth = async () => {
        try {
            const user = await account.get();
            setIsAuthenticated(true);
            setUserData({ name: user.name, email: user.email });
        } catch (error) {
            setIsAuthenticated(false);
            setUserData(null);
        }
    };

    const login = async (email, password) => {
        try {
            await account.createEmailPasswordSession(email, password);
            setIsAuthenticated(true);
            await checkAuth();
            toast.success('Logged in successfully!');
        } catch (error) {
            console.error("Login error:", error.message);
            toast.error('Login failed: ' + error.message);
        }
    };

    const register = async (email, password, fullName) => {
        try {
            await account.create(ID.unique(), email, password, fullName);
            await sendVerificationEmail(); // Send verification email after registration
            await login(email, password);
            toast.success('Registration successful! Please check your email to verify your account.');
        } catch (error) {
            console.error("Registration error:", error.message);
            toast.error('Registration failed: ' + error.message);
        }
    };

    const sendVerificationEmail = async () => {
        try {
            await account.createVerification('http://localhost:3000/verify'); // Replace with your actual verification URL
            toast.success('Verification email sent! Please check your inbox.');
        } catch (error) {
            console.error("Verification error:", error.message);
            toast.error('Failed to send verification email: ' + error.message);
        }
    };

    const loginWithGoogle = async () => {
        try {
            await account.createOAuth2Session('google', 'http://localhost:3000');
            setIsAuthenticated(true);
            await checkAuth();
            toast.success('Logged in with Google successfully!');
        } catch (error) {
            console.error("Google login error:", error.message);
            toast.error('Google login failed: ' + error.message);
        }
    };

    const loginWithGitHub = async () => {
        try {
            await account.createOAuth2Session('github', 'http://localhost:3000');
            setIsAuthenticated(true);
            await checkAuth();
            toast.success('Logged in with GitHub successfully!');
        } catch (error) {
            console.error("GitHub login error:", error.message);
            toast.error('GitHub login failed: ' + error.message);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <UserContext.Provider value={{ isAuthenticated, userData, setIsAuthenticated, login, register, loginWithGoogle, loginWithGitHub, sendVerificationEmail }}>
            {children}
        </UserContext.Provider>
       
    );
}

export const useUser = () => {
    return useContext(UserContext);
};
