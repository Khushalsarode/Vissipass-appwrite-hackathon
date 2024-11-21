// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import Dashboard from './components/Dashboard';
import RecordList from './components/RecordList';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './lib/context/user';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Generatepass from './components/generatepass';
import Generatedpass from './components/generatedpass';
import DailyRecordChecker from './components/activepasscheck';
import Verify from './components/Verify';
import ResetPassword from './components/ResetPassword'; 
import Archieve from './components/Archieve';
import VerifyVisitorPass from './components/VerifyVisitorPass';
//import './App.css';
function AppRoutes() {
    const location = useLocation();

    return (
        <Routes key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-pass" element={<VerifyVisitorPass />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/record-list"
                element={
                    <ProtectedRoute>
                        <RecordList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/generate-pass"
                element={
                    <ProtectedRoute>
                        <Generatepass />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/generated-pass"
                element={
                    <ProtectedRoute>
                        <Generatedpass />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/recordChecker"
                element={
                    <ProtectedRoute>
                        <DailyRecordChecker />
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/verify-pass" 
                element={
                    <ProtectedRoute>
                        <VerifyVisitorPass />
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/archive" 
                element={
                    <ProtectedRoute>
                        <Archieve />
                    </ProtectedRoute>
                } 
            />
        </Routes>
    );
}

function App() {
    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <AppRoutes />
                    <ToastContainer />
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
