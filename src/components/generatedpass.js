import React, { useEffect, useState } from 'react';
import { databases, storage } from '../lib/appwrite';
import { toast } from 'react-toastify';
import { QRCodeCanvas } from 'qrcode.react';
import QRCode from 'qrcode';
import './GeneratedPass.css';
import axios from 'axios';

const GeneratedPass = () => {
    const [records, setRecords] = useState([]);
    const [generatedCodes, setGeneratedCodes] = useState(new Set());
    const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID;
    const collectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID_USERDATAPASS;
    const storagebucketqr = process.env.REACT_APP_APPWRITE_STORAGE_BUCKET_QR;
    const endpoint = process.env.REACT_APP_APPWRITE_ENDPOINT;

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

    const handleCreatePass = async (record) => {
        // Prevent generating QR code for already generated records
        if (generatedCodes.has(record.$id)) {
            return;
        }
    
        try {
            const verificationUrl = `http://localhost:3000/verify-pass?id=${record.$id}`;
            //${endpoint}/verify-pass?id=${record.$id} //at live version can replace endpoint to real domain endpoint
            const canvas = document.createElement('canvas');
            await QRCode.toCanvas(canvas, verificationUrl, { width: 256 });
    
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    console.error('Failed to create blob from QR code');
                    toast.error('QR code generation failed');
                    return;
                }
    
                const fileName = `${record.$id}`;
    
                try {
                    const existingFilesResponse = await storage.listFiles(storagebucketqr);
                    const existingFile = existingFilesResponse.files.find(file => file.name === fileName);
    
                    let fileResponse;
                    if (existingFile) {
                        fileResponse = await storage.updateFile(
                            storagebucketqr,
                            existingFile.$id,
                            new File([blob], fileName, { type: 'image/png' })
                        );
                    } else {
                        fileResponse = await storage.createFile(
                            storagebucketqr,
                            fileName,
                            new File([blob], fileName, { type: 'image/png' })
                        );
                    }
    
                    if (fileResponse && fileResponse.$id) {
                        const storageUrl = `${endpoint}/storage/buckets/${storagebucketqr}/files/${fileResponse.$id}/view?project=${process.env.REACT_APP_APPWRITE_PROJECT_ID}&mode=admin`;
    
                        await databases.updateDocument(
                            databaseId,
                            collectionId,
                            record.$id,
                            {
                                storageUrl: storageUrl,
                                verificationUrl: verificationUrl
                            }
                        );
    
                        // Update state to include the generated ID
                        setGeneratedCodes(prev => new Set(prev).add(record.$id));
                        toast.success('Visitor pass created with QR code and verification URL.');
                        // Send email notification
                   // Call the send-email API
                   try {
                    const emailData = {
                        to: record.email, // Replace with the actual recipient email
                        subject: 'Hello, Your Visit has been Schedule!', // Replace with dynamic data if needed
                        company: record.company, // Replace with dynamic data if needed
                        $id: record.$id,
                        firstName: record.firstName, // Adjust fields accordingly
                        lastName: record.lastName,
                        userImage: record.userImage, // Adjust field accordingly
                        employeeId: record.employeeId, // Adjust field accordingly
                        qrCodeUrl: storageUrl, // Use the generated URL for the QR code
                        dateOfVisit: record.dateOfVisit, // Adjust field accordingly
                        purpose: record.purposeOfVisit, // Adjust field accordingly
                        department: record.department, // Adjust field accordingly
                        badgeType: record.badgeType // Adjust field accordingly
                    };
                    console.log('Email data:', emailData);

                    await axios.post('http://localhost:5000/send-email', emailData);
                    toast.success('Email sent successfully');
                } catch (error) {
                    console.error('Error sending email:', error);
                    toast.error('Failed to send email');
                }
                    } else {
                        console.error('File upload response is missing required properties:', fileResponse);
                        toast.error('Failed to retrieve file ID from storage response.');
                    }
                } catch (uploadError) {
                    console.error('Error uploading file to storage:', uploadError);
                }
            }, 'image/png');
        } catch (error) {
            console.error('Error creating visitor pass:', error);
            toast.error('Failed to create and store visitor pass.');
        }
    };
    

    return (
        <div>
        <div className="generated-pass">
            <h2>Generated Visitor Pass</h2>
            {records.length === 0 ? (
                <p>No records found</p>
            ) : (
                <table className="record-table">
                    <thead>
                        <tr>
                            <th>Profile Photo</th>
                            <th>QR Code</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Date of Visit</th>
                            <th>Purpose</th>
                            <th>Department</th>
                            <th>Badge Type</th>
                            <th>Employee ID</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.$id}>
                                <td>
                                    <img
                                        src={record.userImage}
                                        alt={`${record.firstName} ${record.lastName}`}
                                        style={{ width: '50px', height: '50px', borderRadius: '5px',border: '1px solid #ddd' }}
                                    />
                                </td>
                                <td>
                                    {record.storageUrl ? (
                                        <img
                                            src={record.storageUrl}
                                            alt="QR Code"
                                            style={{ width: '50px', height: '50px' }}
                                        />
                                    ) : (
                                        <QRCodeCanvas value={record.verificationUrl || 'Generating...'} size={50} />
                                    )}
                                </td>
                                <td>{record.firstName}</td>
                                <td>{record.lastName}</td>
                                <td>{record.phone}</td>
                                <td>{record.email}</td>
                                <td>{record.company}</td>
                                <td>{new Date(record.dateOfVisit).toLocaleString()}</td>
                                <td>{record.purposeOfVisit}</td>
                                <td>{record.department}</td>
                                <td>{record.badgeType}</td>
                                <td>{record.employeeId}</td>
                                <td>
                                    {/* Button for generating QR code */}
                                    {!generatedCodes.has(record.$id) ? (
                                        <button onClick={() => handleCreatePass(record)}>Generate QR Code</button>
                                    ) : (
                                        <span>Generated</span> // Optional: Display a message or icon after generation
                                    )}
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

export default GeneratedPass;
