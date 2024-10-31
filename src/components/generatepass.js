import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './VisitorPassForm.css';
import { databases, ID, storage } from '../lib/appwrite.js'; // Import Appwrite services
import { toast } from 'react-toastify';

const VisitorPassForm = () => {
    const [isOrgPass, setIsOrgPass] = useState(false);
    const [formVisible, setFormVisible] = useState(true); // State to control form visibility
    const [userImage, setUserImage] = useState(null); // State for user image
    const [imageFile, setImageFile] = useState(null); // State for the actual file

    const initialValues = {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        company: '',
        dateOfVisit: '',
        purposeOfVisit: '',
        department: '',
        badgeType: '',
        employeeId: '', // New field for employee/student ID
    };

    const validationSchema = Yup.object({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        phone: Yup.string().required('Phone is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        company: Yup.string().required('Company/Organization is required'),
        dateOfVisit: Yup.date().required('Date of Visit is required').nullable(),
        purposeOfVisit: Yup.string().required('Purpose of Visit is required'),
        department: Yup.string().required('Department/Office Location is required'),
        badgeType: Yup.string().required('Badge Type/Access Level is required'),
        employeeId: isOrgPass ? Yup.string().required('Employee/Student ID is required') : Yup.string(), // Conditionally required
    });

    const handleImageChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            setImageFile(file); // Set the actual file for upload
            setUserImage(URL.createObjectURL(file)); // Create a local URL for the image preview
        }
    };

    const handleSubmit = async (values) => {
        try {
            // Parse and format dateOfVisit to a valid date format
            const formattedDate = new Date(values.dateOfVisit).toISOString(); // Convert to ISO string

            // Prepare data for submission
            const dataToSubmit = {
                ...values,
                dateOfVisit: formattedDate, // Store the formatted date
            };

            // Define your database and collection IDs
            const databaseId = 'id'; // Replace with your database ID
            const collectionId = 'id'; // Replace with your collection ID
            const documentId = ID.unique(); // Generate a unique document ID

            // Handle the image upload to Appwrite Storage
            let imageUrl = null;
            if (imageFile) {
                const imageResponse = await storage.createFile(
                    'id', // Replace with your storage bucket ID
                    ID.unique(),
                    imageFile
                );

                // Construct the full image URL
                const projectId = 'id'; // Your Appwrite project ID
                imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/67234ad60025be69fa97/files/${imageResponse.$id}/view?project=${projectId}&mode=admin`;
            }

            // Include the user image in the submission if necessary
            if (imageUrl) {
                dataToSubmit.userImage = imageUrl; // Store the image URL
                console.log('Image uploaded:', imageUrl);
            }

            // Insert values into the database
            const response = await databases.createDocument(databaseId, collectionId, documentId, dataToSubmit);
            console.log('Document created:', response);
            toast.success('Visitor pass created, status will be updated through mail'); // Show a success message
            
            // Hide the form after submission
            setFormVisible(false);
        } catch (error) {
            console.error('Error creating document:', error);
            toast.error('Failed to store data into system: ' + error.message); // Show an error message
        }
    };

    if (!formVisible) {
        return <div className="success-message">Visitor pass created successfully!</div>; // Message after submission
    }

    return (
        <div className="visitor-pass-form">
            <h2 className="form-title">Visit Information Form</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        {/* Input for User Image */}
                        <div className="form-group">
                            <label htmlFor="userImage">Upload User Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <ErrorMessage name="userImage" component="div" className="error" />
                        </div>
                        {userImage && (
                            <div className="image-preview">
                                <img src={userImage} alt="Preview" style={{ width: '100px', height: '100px' }} />
                            </div>
                        )}
                        {/* First Name and Last Name */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <Field name="firstName" type="text" />
                                <ErrorMessage name="firstName" component="div" className="error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <Field name="lastName" type="text" />
                                <ErrorMessage name="lastName" component="div" className="error" />
                            </div>
                        </div>

                        {/* Phone and Date of Visit */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <Field name="phone" type="text" />
                                <ErrorMessage name="phone" component="div" className="error" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dateOfVisit">Date of Visit</label>
                                <Field name="dateOfVisit" type="datetime-local" />
                                <ErrorMessage name="dateOfVisit" component="div" className="error" />
                            </div>
                        </div>

                        {/* Remaining Fields */}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Field name="email" type="email" />
                            <ErrorMessage name="email" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="company">Company/Organization</label>
                            <Field name="company" type="text" />
                            <ErrorMessage name="company" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="purposeOfVisit">Purpose of Visit</label>
                            <Field name="purposeOfVisit" type="text" />
                            <ErrorMessage name="purposeOfVisit" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Department/Office Location</label>
                            <Field name="department" type="text" />
                            <ErrorMessage name="department" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="badgeType">Badge Type/Access Level</label>
                            <Field as="select" name="badgeType">
                                <option value="">Select Badge Type</option>
                                <option value="guest">Guest</option>
                                <option value="vendor">Vendor</option>
                                <option value="vip">VIP</option>
                            </Field>
                            <ErrorMessage name="badgeType" component="div" className="error" />
                        </div>
                        {/* Checkbox and Conditional ID Field */}
                        <div className="form-group">
                            <label>
                                <Field
                                    type="checkbox"
                                    name="isOrgPass"
                                    checked={isOrgPass}
                                    onChange={() => setIsOrgPass(!isOrgPass)}
                                />
                                {' '}Check for organization pass (with ID)
                            </label>
                        </div>
                        {isOrgPass && (
                            <div className="form-group">
                                <label htmlFor="employeeId">Student/Employee ID</label>
                                <Field name="employeeId" type="text" />
                                <ErrorMessage name="employeeId" component="div" className="error" />
                            </div>
                        )}
                        <br />
                        <button type="submit" className="submit-button">Create Pass</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default VisitorPassForm;
