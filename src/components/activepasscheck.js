import React, { useEffect, useState } from 'react';
import { databases } from '../lib/appwrite'; // Import Appwrite SDK configuration

const RecordChecker = () => {
    const [tomorrowRecords, setTomorrowRecords] = useState([]);
    const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID; // Replace with your actual database ID
    const collectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID_ACTIVEPASS; // Replace with your actual collection ID

    useEffect(() => {
        fetchTomorrowRecords();
    }, []);

    // Fetch records that are set to activate tomorrow
    const fetchTomorrowRecords = async () => {
        try {
            // Get tomorrow's date in the correct format (yyyy-mm-dd)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const formattedTomorrow = tomorrow.toISOString().split('T')[0];

            // Fetch all records in the collection
            const response = await databases.listDocuments(databaseId, collectionId);
            
            // Filter records with dateOfVisit set to tomorrow
            const filteredRecords = response.documents.filter(record => 
                new Date(record.dateOfVisit).toISOString().split('T')[0] === formattedTomorrow
            );

            // Update the state with the filtered records
            setTomorrowRecords(filteredRecords);
        } catch (error) {
            console.error('Error fetching records for tomorrow:', error);
        }
    };

    return (
        <div>
            <h2>Passes to be Activated Tomorrow</h2>
            {tomorrowRecords.length === 0 ? (
                <p>No records scheduled to activate tomorrow.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Department</th>
                            <th>Date of Visit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tomorrowRecords.map(record => (
                            <tr key={record.$id}>
                                <td>{record.firstName}</td>
                                <td>{record.lastName}</td>
                                <td>{record.phone}</td>
                                <td>{record.email}</td>
                                <td>{record.company}</td>
                                <td>{record.department}</td>
                                <td>{record.dateOfVisit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RecordChecker;
