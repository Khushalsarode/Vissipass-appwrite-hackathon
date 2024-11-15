import React, { useEffect, useState } from 'react';
import { databases } from '../lib/appwrite';
import { toast } from 'react-toastify';
import './Achieve.css';
import { Query } from 'appwrite';

const Archieve = () => {
    const [archivedRecords, setArchivedRecords] = useState([]);
    const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID;
    const userPassCollectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID_USERDATAPASS;
    const archiveCollectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID_ARCHIEVEPASS;

    const fetchAndArchiveRecords = async () => {
        try {
            // Fetch records with isUsed set to true from the user pass collection
            const userPassRecords = await databases.listDocuments(databaseId, userPassCollectionId, [
                Query.equal('isUsed', true)
            ]);

            for (const record of userPassRecords.documents) {
                const { $id, $databaseId, $collectionId, $permissions, $createdAt, $updatedAt, ...recordData } = record;

                const archiveData = {
                    ...recordData,
                    archivedDate: new Date().toISOString(),
                    expirationDate: record.expirationDate || '' // Empty string if expirationDate is missing
                };

                try {
                    // Archive the document with a unique ID in the archive collection
                    await databases.createDocument(
                        databaseId,
                        archiveCollectionId,
                        'unique()', // Generate a unique ID
                        archiveData
                    );

                    // Verify existence before deleting the record from the user pass collection
                    await databases.getDocument(databaseId, userPassCollectionId, $id);
                    await databases.deleteDocument(databaseId, userPassCollectionId, $id);
                } catch (archiveError) {
                    console.error(`Failed to archive or delete record with ID ${$id}:`, archiveError);
                    toast.error(`Failed to archive record with ID ${$id}`);
                }
            }

            // Fetch all archived records to display
            const archivedRecordsResponse = await databases.listDocuments(databaseId, archiveCollectionId);
            setArchivedRecords(archivedRecordsResponse.documents);
            if(!archivedRecordsResponse){
            toast.success('Records archived successfully!');
            }
        } catch (error) {
            console.error('Error fetching and archiving records:', error);
            toast.error('Failed to archive records: ' + error.message);
        }
    };

    useEffect(() => {
        fetchAndArchiveRecords();
    }, []);

    return (
        <div>
        <div className="achieve">
            <h2>Archived Records</h2>
            {archivedRecords.length === 0 ? (
                <p>No archived records found.</p>
            ) : (
                <table className="archived-records-table">
                    <thead>
                        <tr>
                            <th>Profile Pic</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Date of Visit</th>
                            <th>Expiration Date</th>
                            <th>Purpose</th>
                            <th>Department</th>
                            <th>Badge Type</th>
                            <th>Employee ID</th>
                            <th>Archived Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {archivedRecords.map((record) => (
                            <tr key={record.$id}>
                                <td>
                                    <img
                                        src={record.userImage}
                                        alt={`${record.firstName} ${record.lastName}`}
                                        style={{ width: '50px', height: '50px', borderRadius: '5px',border: '1px solid #ddd' }}
                                    />
                                </td>
                                <td>{record.firstName}</td>
                                <td>{record.lastName}</td>
                                <td>{record.email}</td>
                                <td>{record.phone}</td>
                                <td>{record.company}</td>
                                <td>{new Date(record.dateOfVisit).toLocaleString()}</td>
                                <td>{new Date(record.expirationDate).toLocaleString()}</td>
                                <td>{record.purposeOfVisit}</td>
                                <td>{record.department}</td>
                                <td>{record.badgeType}</td>
                                <td>{record.employeeId}</td>
                                <td>{new Date(record.archivedDate).toLocaleString()}</td>
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

export default Archieve;
