import React, { useEffect, useState } from 'react';
import { databases, messaging } from '../lib/appwrite'; // Import messaging from your appwrite.js
import { toast } from 'react-toastify';
import { QRCodeCanvas } from 'qrcode.react';
import './GeneratedPass.css';

const GeneratedPass = () => {
    const [records, setRecords] = useState([]);
    const databaseId = 'id';
    const collectionId = 'id';

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
        try {
            const qrData = JSON.stringify({
                id: record.$id,
                name: `${record.firstName} ${record.lastName}`,
                email: record.email,
                dateOfVisit: record.dateOfVisit,
            });

            const qrCanvas = document.createElement('canvas');
            const qrCode = new QRCodeCanvas({
                value: qrData,
                size: 100,
            });
            qrCode.appendTo(qrCanvas);
            const qrImageUrl = qrCanvas.toDataURL();

            const passContent = `
                <h1>Visitor Pass</h1>
                <p>Name: ${record.firstName} ${record.lastName}</p>
                <p>Phone: ${record.phone}</p>
                <p>Email: ${record.email}</p>
                <p>Company: ${record.company}</p>
                <p>Date of Visit: ${new Date(record.dateOfVisit).toLocaleString()}</p>
                <p>Purpose: ${record.purposeOfVisit}</p>
                <p>Department: ${record.department}</p>
                <p>Badge Type: ${record.badgeType}</p>
                <p>Employee ID: ${record.employeeId}</p>
                <img src="${qrImageUrl}" alt="QR Code" style="width:100px; height:100px;" />
            `;

            await sendVisitorPassEmail(record.email, 'Your Visitor Pass', passContent);
            toast.success(`Visitor pass sent to ${record.email}`);
        } catch (error) {
            console.error('Error creating visitor pass:', error);
            toast.error('Failed to create and send visitor pass.');
        }
    };

    const sendVisitorPassEmail = async (to, subject, htmlContent) => {
        try {
            const message = await messaging.createEmail(
                '67236f7600283b9eec3a',  // Replace with your actual message ID
                subject,
                htmlContent,
                [],  // topics (optional)
                [],  // users (optional)
                [],  // targets (optional)
                [],  // cc (optional)
                [],  // bcc (optional)
                false,  // draft (optional)
                true    // true to send HTML content
            );
            console.log(`Email sent to: ${to} - Message ID: ${message.$id}`);
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Failed to send visitor pass email: ' + error.message);
        }
    };

    return (
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
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                    />
                                </td>
                                <td>
                                    <QRCodeCanvas
                                        value={JSON.stringify({
                                            id: record.$id,
                                            name: `${record.firstName} ${record.lastName}`,
                                            email: record.email,
                                            dateOfVisit: record.dateOfVisit,
                                        })}
                                        size={50}
                                    />
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
                                    <button onClick={() => handleCreatePass(record)}>Create Pass</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GeneratedPass;
