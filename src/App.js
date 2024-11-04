// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import Dashboard from './components/Dashboard';
import RecordList from './components/RecordList'; // Import the RecordList component
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
import { useUser } from './lib/context/user';
import { useEffect, useState } from 'react';

function App() {
    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/verify" element={<Verify />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
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
                            path="/Generated-pass"
                            element={
                                <ProtectedRoute>
                                    <Generatedpass />
                                </ProtectedRoute>
                            }
                        />
                         <Route
                            path="/RecordChecker"
                            element={
                                <ProtectedRoute>
                                    <DailyRecordChecker />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                    <ToastContainer />
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
