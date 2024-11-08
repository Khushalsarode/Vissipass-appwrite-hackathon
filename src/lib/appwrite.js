// src/lib/appwrite.js
import { Client, Account, Databases, Storage, Functions, ID, AuthenticatorType, Messaging  } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();
client
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT) // Your Appwrite endpoint
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);// Your Appwrite project ID

// Export commonly used Appwrite services
export const account = new Account(client);         // For user authentication
export const databases = new Databases(client);     // For database operations
export const storage = new Storage(client);         // For file storage
export const functions = new Functions(client);     // For cloud functions execution yet to be used for QR code scan and email sending
export const messaging = new Messaging(client);     // For messaging/email functionality yet to be used for email sending for generated and expired pass
export { AuthenticatorType, client, ID,Client,Functions };
