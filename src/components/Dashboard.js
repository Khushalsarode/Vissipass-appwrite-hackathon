import React, { useState, useEffect } from 'react';
import { useUser } from '../lib/context/user';
import { account, client,databases, Functions } from '../lib/appwrite';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHistory, faCog, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Avatars, Flag, Client  } from "appwrite";


const Dashboard = () => {
    const { isAuthenticated, userData } = useUser(); 
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [hasPromptedVerification, setHasPromptedVerification] = useState(false); // New state
     // New state for change password functionality
     const [currentPassword, setCurrentPassword] = useState('');
     const [newPassword, setNewPassword] = useState('');
     const [showChangePassword, setShowChangePassword] = useState(false); // To toggle visibility of change password form
    
    const [loading, setLoading] = useState(true); // Loading state


    useEffect(() => {
        if (isAuthenticated) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false); // Stop loading after 2 seconds
            }, 2000);
        }
    }, [isAuthenticated]);

    const [profile, setProfile] = useState({
        username: '',
        email: '',
        profilePicture: '',
        createdAt: '',
        location: '',
        lastPasswordChange: '',
        log: '',
        updatedAt: '',
        accountType: '',
        notificationPreferences: {}
    });
    
    const [recentActivity, setRecentActivity] = useState([]);

    const [verificationStatus, setVerificationStatus] = useState('Pending');
    
    useEffect(() => {
        document.body.className = theme;

        if (isAuthenticated) {
            // Fetch user profile data
            const fetchProfile = async () => {
                const userDetails = await account.get();
                console.log("userDetails",userDetails);
                setProfile(prevProfile => ({
                    ...prevProfile,
                    username: userDetails.name,
                    userId: userDetails.$id,
                    updatedAt: userDetails.$updatedAt,
                    email: userDetails.email,
                    notificationPreferences: userDetails.prefs || {}, 
                    accountType: userDetails.provider,
                    log: userDetails.accessedAt,
                    profilePicture: userDetails.profilePicture || '',
                    createdAt: new Date(userDetails.registration).toLocaleDateString(),
                    lastPasswordChange: userDetails.passwordUpdate ? new Date(userDetails.passwordUpdate).toLocaleDateString() : 'Never'
                }));
                // Set location dynamically
                setLocation(userDetails.location);
            };

          

            fetchProfile();
        }
    }, [theme, isAuthenticated, userData]);

    

    // Function to set location using Geolocation API
    const setLocation = async (defaultLocation) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                // Optionally, use a reverse geocoding service to convert coordinates to a location name
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                const data = await response.json();
                const locationName = data.display_name || 'Location not found';

                setProfile(prevProfile => ({
                    ...prevProfile,
                    location: locationName
                }));

                // Optionally, you can update the location in your Appwrite database
                // await account.update(userData.$id, { location: locationName });
                //toast.success(`Location updated to: ${locationName}`);
            }, () => {
                // Handle location permission denial
                setProfile(prevProfile => ({
                    ...prevProfile,
                    location: defaultLocation || 'Location access denied'
                }));
                toast.warn('Location access denied. Showing default location.');
            });
        } else {
            setProfile(prevProfile => ({
                ...prevProfile,
                location: defaultLocation || 'Geolocation not supported'
            }));
            toast.error('Geolocation not supported by your browser.');
        }
    };

    // Toggle Theme
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.body.className = newTheme;
        toast.info(`Theme switched to ${newTheme}`, { autoClose: 2000 });
    };
    const avatars = new Avatars(client);

    const Cflag = avatars.getFlag(
        Flag.India, // code
        30, // width (optional)
        20, // height (optional)
        100 // quality (optional)
    );
    
    useEffect(() => {
        if (isAuthenticated) {
            const checkVerificationStatus = async () => {
                try {
                    const userDetails = await account.get();
                    const isVerified = userDetails.emailVerification;
                    setVerificationStatus(isVerified ? 'Verified' : 'Pending');

                    // Set prompt only if the user is not verified and hasn't been prompted yet
                    if (!isVerified && !hasPromptedVerification) {
                        setHasPromptedVerification(true); // Mark as prompted
                    }
                } catch (error) {
                    console.error("Error fetching verification status:", error);
                }
            };
            checkVerificationStatus();
        }
    }, [isAuthenticated]);

    const handleVerification = async () => {
        try {
            const redirectUrl = `${window.location.origin}/verify`;
            await account.createVerification(redirectUrl);
            toast.info("Verification OTP sent to your email.");
        } catch (error) {
            toast.error("Failed to send verification email. Please try again.");
            console.error("Verification error:", error);
        }
    };

    
    const handleChangePassword = async () => {
        try {
            await account.updatePassword(newPassword, currentPassword);
            toast.success("Password changed successfully.");
            // Reset password fields after success
            setCurrentPassword('');
            setNewPassword('');
            setShowChangePassword(false); // Optionally close the change password form
        } catch (error) {
            toast.error("Failed to change password. Please check your current password.");
            console.error("Password change error:", error);
        }
    };

    const handleClearCache = async () => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            toast.error("You need to be logged in to clear the cache.");
            return;
        }
    
        const confirmClear = window.confirm("Are you sure you want to clear the cache and cookies?");
        if (confirmClear) {
            // Clear localStorage
            localStorage.clear();
    
            // Clear cookies (optional, depending on your implementation)
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
    
            // Reset application state (customize this as needed)
            // Example: dispatch({ type: 'RESET' });
    
            try {
                // Log out the user
                //await account.deleteSession('current'); // Adjust according to your authentication method
                toast.success("Cache and cookies cleared successfully. You have been logged out.");
    
                // Redirect to the login page
                window.location.href = '/login'; // Adjust the path as needed for your routing
            } catch (error) {
                toast.error("Failed to log out. Please try again.");
                console.error(error);
            }
        }
    };
    
            
    const handleDeleteData = async () => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            toast.error("You need to be logged in to delete data.");
            return;
        }
    
        const confirmDelete = window.confirm("Are you sure you want to delete your data?");
        if (confirmDelete) {
            try {
                // Assuming you have a collection ID and document ID for the user data
                const userId = userData.$id; // Get the authenticated user's ID; yet to be used in multiple users 
                const collectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID_USERDATAPASS; // Replace with your actual collection ID
                //console.log("collectionId",collectionId);
                //console.log("userId",userId);
                // Delete the document associated with the user
                await databases.deleteDocument(collectionId, userId);
    
                toast.success("Data deleted successfully.");
            } catch (error) {
                toast.error("Failed to delete data. Please try again.");
                console.error("Error deleting data:", error);
            }
        }
    };
    
    const handleDeleteAccount = async () => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            toast.error("You need to be logged in to delete your account.");
            return;
        }
    
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmDelete) {
            try {
                const userId = userData.$id;
                // Delete the user account
                await account.delete(userId); // This deletes the authenticated user's account
    
                toast.success("Account deleted successfully.");
                window.location.href = '/login'; // Redirect to the login page
                // Optionally, redirect the user or log them out
                // e.g., redirect to the home page or show a login button
            } catch (error) {
                toast.error("Failed to delete account. Please try again.");
                console.error("Error deleting account:", error);
            }
        }
    };
    


    
      const [analyticsData, setAnalyticsData] = useState(null);

      useEffect(() => {
        // Initialize Appwrite Client
        const client = new Client();
        client
          .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT)
          .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);
    
        const functions = new Functions(client);
    
        // Call the Appwrite function
        functions
          .createExecution(process.env.REACT_APP_APPWRITE_FUNCTION_ID_GETUSERLOGS)
          .then((response) => {
            let responseBody = response.responseBody;
    
            try {
              // Parse responseBody to JSON
              const data = JSON.parse(responseBody);
              setAnalyticsData(data); // Save data to state
            } catch (error) {
              console.error('Failed to parse responseBody:', responseBody, error);
              setAnalyticsData({ error: 'Failed to parse response data' });
            }
    
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching analytics:', error);
            setAnalyticsData({ error: error.message });
            setLoading(false);
          });
      }, []);
      if (!analyticsData) {
        return <div>Loading...</div>;
      }
    
    

    return (
        <div>
        {loading ? (
           <div className="loading-screen">
           <div className="spinner"></div><br/>
           <div className="message">Loading...</div>
       </div>       
        ) : (
            <>
            <div className="dashboard">
                <ToastContainer />
                <header className="dashboard-header">
                    <h1>Welcome to Your Dashboard</h1>
                    {isAuthenticated && (
                        <p className="welcome-message">
                            Hello, <strong>{profile.username}</strong>! You are logged in. 
                            Here you can view and manage your activities.
                        </p>
                    )}
                </header>
                <div className="dashboard-content">
                    {/* Profile Overview Section */}
                    <section className="dashboard-section profile-overview">
                        <h2><FontAwesomeIcon icon={faUser} /> &nbsp; Personl Information </h2>
                        <strong>User ID: {profile.userId}</strong> <br/>
                        <strong>Username: {profile.username}</strong> <br/>
                        <strong>Access Level: <strong>Admin</strong> </strong><br/>
                        <strong>Email: {profile.email} <br/></strong>
                        <strong>Member Since: {profile.createdAt} </strong>  <br/>
                        <strong>Location: {profile.location} </strong><br/>
                        Access Location: <img src={Cflag} alt="Profile" className="profile-picture" /> <br/>    
                        {/* <img src={profile.profilePicture} alt="Profile" className="profile-picture" /> */}
                    </section>

                    {/* Recent Activity Section */}
                    <section className="dashboard-section recent-activity">
                        <h2><FontAwesomeIcon icon={faHistory} /> &nbsp; Recent Activity</h2>
                        <ul>
                            {recentActivity.map((activity, index) => (
                                <li key={index}>
                                    {activity.event}: {new Date(activity.date).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                        {/* Last Updated profile */}
                        <strong>Last Updated:</strong> {new Date(profile.updatedAt).toLocaleString()} <br/>
                        {/* Last Access Log */}
                        <strong>Last Access:</strong>{new Date(profile.log).toLocaleString()} <br/> 
                    
                        <strong>Notification Preferences:</strong>
                    <ul>
                        <li>Email: {profile.notificationPreferences.email ? 'Enabled' : 'Disabled'}</li>
                        <li>SMS: {profile.notificationPreferences.sms ? 'Enabled' : 'Disabled'}</li>
                        <li>In-App Notifications: {profile.notificationPreferences.inApp ? 'Enabled' : 'Disabled'}</li>
                    </ul>

                        {/* Account Verification Status */}
                        <strong>Account Verification Status</strong> <br/>
                        <strong>Status:</strong> {verificationStatus}
                        {/* Only show button if status is Pending and not prompted */}
                        {verificationStatus === 'Pending' && !hasPromptedVerification && (
                            <button onClick={handleVerification}>Validate Email</button>
                        )} <br/>
                        {/* Last Password Change */}
                        <strong>Last Password Change: </strong> {profile.lastPasswordChange}
                    </section>

                     {/* Application Analytics Section */}
                     <section className="dashboard-section analytics">
                            <h2>
                            <FontAwesomeIcon icon={faChartLine} /> &nbsp; Application Analytics
                            </h2>
                            {loading ? (
                                <p>Loading analytics data...</p>
                                ) : analyticsData?.error ? (
                                <p className="error-message">Error: {analyticsData.error}</p>
                                ) : (
                                <div className="analytics-content">
                                    {/* Synced Operator Accounts */}
                                    <div className="analytics-card">
                                    <h5>Synced Operator Accounts</h5>
                                    <ul>
                                        <li>Current Operating Users: {analyticsData.totalUsers}</li>
                                    </ul>
                                    </div>

                                    {/* Data Storage Distribution */}
                                    <div className="analytics-card">
                                    <h5>Data Storage Distribution</h5>
                                    <ul>
                                        <li>DataStorage: {analyticsData.database}</li>
                                        <li>Sub DataStorage: {analyticsData.collectionId}</li>
                                    </ul>
                                    </div>

                                    {/* Users Details */}
                                    <div className="analytics-card">
                                    <h5>Users Details</h5>
                                    <ul>
                                        <li>Total Records Under Revive: {analyticsData.documents}</li>
                                        <li>Archived Records: {analyticsData.documentsarchieve}</li>
                                        <li>Active Passes: {analyticsData.documentsuserdata}</li>
                                    </ul>
                                    </div>

                                    {/* Hard Storage */}
                                    <div className="analytics-card">
                                    <h5>Hard Storage</h5>
                                    <ul>
                                        <li>Contains Parts: {analyticsData.totalBuckets}</li>
                                        <li>Images Handled: {analyticsData.bucketsfiles}</li>
                                        <li>QR Code Processed: {analyticsData.QRbucketsfiles}</li>
                                    </ul>
                                    </div>

                                    {/* Remote Verify and Checks */}
                                    <div className="analytics-card">
                                    <h5>Remote Verify and Checks</h5>
                                    <ul>
                                        <li>Remote Function: {analyticsData.totalfunctions}</li>
                                        <li>Wonder this data display!: {analyticsData.getdataremote}</li>
                                        <li>Checks Done!: {analyticsData.getqrdata}</li>
                                    </ul>
                                    </div>

                                    {/* Admin Users Section */}
                                    <div className="analytics-card admin-users">
                                    <h5>Admin User Details</h5>
                                    <ul>
                                        {analyticsData.users?.map((user) => (
                                        <li key={user.id}>
                                            {user.name} (ID: {user.id})
                                        </li>
                                        ))}
                                    </ul>
                                    </div>
                                </div>
                                )}
                        </section>

                    {/* Settings Section */}
                    <section className="dashboard-section settings">
                        <h2><FontAwesomeIcon icon={faCog} /> &nbsp; Settings</h2>
                        <div className="settings-options">
                            {/* Theme Toggle */}
                        
                                <label>Theme: </label>
                                <button onClick={toggleTheme} className="toggle-theme">
                                    {theme === 'light' ? 'Switch to Dark 🌙' : 'Switch to Light 🌞'}
                                </button>

                            <label>Account Access: </label>
                            {/* Toggle Change Password Form */}
                            <button className="change-password" onClick={() => setShowChangePassword(prev => !prev)}>
                                {showChangePassword ? "Cancel Change Password" : "Change Password"}
                            </button>

                            {/* Change Password Form */}
                            {showChangePassword && (
                                <div className="change-password-form">
                                    <input 
                                        type="password" 
                                        placeholder="Current Password" 
                                        value={currentPassword} 
                                        onChange={(e) => setCurrentPassword(e.target.value)} 
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="New Password" 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                    />
                                    <button className="change-passowrd-submit" onClick={handleChangePassword}>Submit</button>
                                </div>
                            )}

                            {/* Clear Cache */}
                            <button onClick={handleClearCache} className="clear-cache">Clear Cache</button>

                            {/* Delete Data */}
                            <button onClick={handleDeleteData} className="delete-data">Delete Data</button>

                            {/* Delete Account */}
                            <button onClick={handleDeleteAccount} className="delete-account">Delete Account</button>
                        </div>
                    </section>
                </div>
            
            </div>
        </>
    )} 
    <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Visitor Pass Generation. All Rights Reserved.</p>
            </footer>
    </div> 
    );
};

export default Dashboard;
