import React, { useEffect, useState } from 'react';
import { databases } from '../lib/appwrite'; // Import Appwrite services
import { toast } from 'react-toastify';
import './RecordList.css';

const RecordList = () => {
    const [records, setRecords] = useState([]);

    // Replace with your database and collection IDs
    const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID; 
    const collectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID_INITIALUSERSDATA;
    const acceptedCollectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID_USERDATAPASS; // ID of the collection for accepted records

    // Fetch records from the Appwrite collection
    const fetchRecords = async () => {
        try {
            const response = await databases.listDocuments(databaseId, collectionId);
            setRecords(response.documents);
        } catch (error) {
            console.error('Error fetching records:', error);
            toast.error('Failed to fetch records: ' + error.message);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    // Handle Accept action - move record to a new collection and delete from the current collection
    const handleAccept = async (documentId) => {
        try {
            const recordToAccept = records.find(record => record.$id === documentId);
            const recordData = Object.keys(recordToAccept)
                .filter((key) => !key.startsWith('$'))
                .reduce((obj, key) => {
                    obj[key] = recordToAccept[key];
                    return obj;
                }, {});
            
                // Add missing mandatory fields with default or empty values if not present
            if (!recordData.verificationUrl && !recordData.storageUrl) {
                recordData.verificationUrl = ''; // Default or placeholder value
                recordData.storageUrl = ''; // Default or placeholder value
            }             
            
            await databases.createDocument(
                databaseId,
                acceptedCollectionId,
                'unique()', // Use 'unique()' to auto-generate an ID
                recordData
            );

            await databases.deleteDocument(databaseId, collectionId, documentId);

            toast.success(`Visitor accepted and moved to the new collection`);
            fetchRecords(); // Refresh records after accepting
        } catch (error) {
            console.error(`Error moving record to new collection:`, error);
            toast.error(`Failed to accept visitor: ` + error.message);
        }
    };

    // Handle Deny action - delete the record from the current collection
    const handleDeleteRecord = async (documentId) => {
        try {
            await databases.deleteDocument(databaseId, collectionId, documentId);
            toast.success('Visitor record denied and deleted successfully!');
            fetchRecords(); // Refresh records after deletion
        } catch (error) {
            console.error(`Error deleting record:`, error);
            toast.error('Failed to delete visitor record: ' + error.message);
        }
    };

    return (
        <div>
        <div className="record-list">
            <h2>Visitor Records</h2>
            {records.length === 0 ? (
                <p>No records found</p>
            ) : (
                <table className="record-table">
                    <thead>
                        <tr>
                            <th>Image</th> {/* Add Image column header */}
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Date of Visit</th>
                            <th>Purpose</th>
                            <th>Department</th>
                            <th>Badge Type</th>
                            <th>Employee/Student ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.$id}>
                                <td>
                                    {record.userImage && ( // Use the userImage field here
                                        <img 
                                            src={record.userImage} 
                                            alt={`${record.firstName} ${record.lastName}`} 
                                            className="record-image" 
                                            style={{ width: '50px', height: '50px' }} 
                                        />
                                    )}
                                </td>
                                <td>{record.firstName}</td>
                                <td>{record.lastName}</td>
                                <td>{record.phone}</td>
                                <td>{record.email}</td>
                                <td>{record.company}</td>
                                <td>{new Date(record.dateOfVisit).toLocaleString()}</td> {/* Formatting Date */}
                                <td>{record.purposeOfVisit}</td>
                                <td>{record.department}</td>
                                <td>{record.badgeType}</td>
                                <td>{record.employeeId}</td>
                                <td>
                                    <button
                                        onClick={() => handleAccept(record.$id)}
                                        className="accept-button"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRecord(record.$id)}
                                        className="deny-button"
                                    >
                                        Deny
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
        </div>
        <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Visitor Pass Generation. All Rights Reserved.</p>
    </footer>
    </div>
    );
};

export default RecordList;
