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
    const bucketId = process.env.REACT_APP_APPWRITE_STORAGE_BUCKET_ID; // Replace with your storage bucket ID
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
                verificationUrl: '',
                storageUrl:'',  
                isUsed: false, // New field for pass verification status

            };

            // Define your database and collection IDs
            const databaseId = process.env.REACT_APP_APPWRITE_DATABASE_ID; // Replace with your database ID
            const collectionId = process.env.REACT_APP_APPWRITE_COLLECTION_ID_USERDATAPASS; // Replace with your collection ID
            const documentId = ID.unique(); // Generate a unique document ID

            // Handle the image upload to Appwrite Storage
            let imageUrl = null;
            if (imageFile) {
                const imageResponse = await storage.createFile(
                    bucketId, // Replace with your storage bucket ID
                    ID.unique(),
                    imageFile
                );

                // Construct the full image URL
                const projectId = process.env.REACT_APP_APPWRITE_PROJECT_ID; // Your Appwrite project ID
                imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${imageResponse.$id}/view?project=${projectId}&mode=admin`;
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
        //reset state here after submission and display toast message instead of this message
    }

    
    return (
        <div>
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
                            <Field as="select" name="company">
                                <option value="">Select Company/Organization</option>

                                {/* School List */}
                                <optgroup label="Schools">
                                    <option value="Green Valley High School">Green Valley High School</option>
                                    <option value="Sunnydale Elementary School">Sunnydale Elementary School</option>
                                    <option value="Lincoln Middle School">Lincoln Middle School</option>
                                    <option value="Harmony Charter School">Harmony Charter School</option>
                                    <option value="Woodland Park High School">Woodland Park High School</option>
                                </optgroup>

                                {/* Colleges List */}
                                <optgroup label="Colleges">
                                    <option value="City Community College">City Community College</option>
                                    <option value="Northfield College">Northfield College</option>
                                    <option value="Riverside College">Riverside College</option>
                                    <option value="St. Andrews College">St. Andrews College</option>
                                    <option value="Brighton College of Arts">Brighton College of Arts</option>
                                </optgroup>

                                {/* Universities/Institutes */}
                                <optgroup label="Universities & Institutes">
                                    <option value="Harvard University">Harvard University</option>
                                    <option value="Stanford University">Stanford University</option>
                                    <option value="Massachusetts Institute of Technology (MIT)">Massachusetts Institute of Technology (MIT)</option>
                                    <option value="California Institute of Technology (Caltech)">California Institute of Technology (Caltech)</option>
                                    <option value="Indian Institute of Technology (IIT)">Indian Institute of Technology (IIT)</option>
                                    <option value="National Institute of Technology (NIT)">National Institute of Technology (NIT)</option>
                                </optgroup>

                                {/* Companies List */}
                                <optgroup label="Companies">
                                    <option value="Google LLC">Google LLC</option>
                                    <option value="Microsoft Corporation">Microsoft Corporation</option>
                                    <option value="Apple Inc.">Apple Inc.</option>
                                    <option value="Amazon.com Inc.">Amazon.com Inc.</option>
                                    <option value="Facebook, Inc.">Facebook, Inc.</option>
                                    <option value="Tesla Inc.">Tesla Inc.</option>
                                    <option value="IBM Corporation">IBM Corporation</option>
                                    <option value="Oracle Corporation">Oracle Corporation</option>
                                </optgroup>

                                {/* Organizations List */}
                                <optgroup label="Organizations">
                                    <option value="World Health Organization (WHO)">World Health Organization (WHO)</option>
                                    <option value="United Nations (UN)">United Nations (UN)</option>
                                    <option value="Red Cross">Red Cross</option>
                                    <option value="World Wildlife Fund (WWF)">World Wildlife Fund (WWF)</option>
                                    <option value="Amnesty International">Amnesty International</option>
                                    <option value="Doctors Without Borders">Doctors Without Borders</option>
                                    <option value="Greenpeace">Greenpeace</option>
                                </optgroup>
                            </Field>
                            <ErrorMessage name="company" component="div" className="error" />
                        </div>

                                            <div className="form-group">
                                <label htmlFor="purposeOfVisit">Purpose of Visit</label>
                                <Field as="select" name="purposeOfVisit" >
                                    <option value="">Select Purpose of Visit</option>

                                    {/* General Purposes */}
                                    <option value="Meeting">Meeting</option>
                                    <option value="Training">Training</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Conference">Conference</option>
                                    <option value="Seminar">Seminar</option>
                                    <option value="Guest_lecture">Guest Lecture</option>
                                    <option value="Networking_event">Networking Event</option>
                                    <option value="Presentation">Presentation</option>
                                    <option value="Collaboration_discussion">Collaboration/Discussion</option>
                                    <option value="Audit">Audit</option>
                                    <option value="Inspection">Inspection</option>
                                    <option value="Contract_signing">Contract Signing</option>
                                    <option value="Sales_pitch">Sales Pitch</option>
                                    <option value="Product_demo">Product Demo</option>
                                    <option value="Vendor_visit">Vendor Visit</option>
                                    <option value="Repair_maintenance">Repair/Maintenance</option>

                                    {/* School/College/University Specific */}
                                    <option value="Admission_inquiry">Admission Inquiry</option>
                                    <option value="Parent_teacher_meeting">Parent-Teacher Meeting</option>
                                    <option value="Student_counseling">Student Counseling</option>
                                    <option value="Scholarship_discussion">Scholarship Discussion</option>
                                    <option value="Student_orientation">Student Orientation</option>
                                    <option value="Extracurricular_event">Extracurricular Event</option>
                                    <option value="Exam_invigilation">Exam Invigilation</option>
                                    <option value="Research_collaboration">Research Collaboration</option>
                                    <option value="Lab_visit">Lab Visit</option>
                                    <option value="Campus_tour">Campus Tour</option>
                                    <option value="Alumni_meet">Alumni Meet</option>
                                    <option value="Sports_event">Sports Event</option>
                                    <option value="Faculty_meeting">Faculty Meeting</option>
                                    <option value="Academic_consultation">Academic Consultation</option>

                                    {/* Company/Corporate Purposes */}
                                    <option value="Client_meeting">Client Meeting</option>
                                    <option value="Business_review">Business Review</option>
                                    <option value="Performance_review">Performance Review</option>
                                    <option value="Strategy_planning">Strategy Planning</option>
                                    <option value="Project_discussion">Project Discussion</option>
                                    <option value="Project_kickoff">Project Kickoff</option>
                                    <option value="Project_status_update">Project Status Update</option>
                                    <option value="Product_launch">Product Launch</option>
                                    <option value="Press_conference">Press Conference</option>
                                    <option value="Media_interaction">Media Interaction</option>
                                    <option value="Investor_meeting">Investor Meeting</option>
                                    <option value="Board_meeting">Board Meeting</option>

                                    {/* Institutional Purposes */}
                                    <option value="Public_speech">Public Speech</option>
                                    <option value="Government_inspection">Government Inspection</option>
                                    <option value="Regulatory_meeting">Regulatory Meeting</option>
                                    <option value="License_verification">License Verification</option>
                                    <option value="Health_safety_audit">Health & Safety Audit</option>
                                    <option value="Community_outreach">Community Outreach</option>
                                    <option value="Awareness_program">Awareness Program</option>
                                    <option value="Volunteering">Volunteering</option>
                                    <option value="Resource_donation">Resource Donation</option>

                                    {/* Specialized Events */}
                                    <option value="Emergency_visit">Emergency Visit</option>
                                    <option value="Incident_investigation">Incident Investigation</option>
                                    <option value="Legal_matter">Legal Matter</option>
                                    <option value="Mediation_session">Mediation Session</option>
                                    <option value="Dispute_resolution">Dispute Resolution</option>
                                    <option value="Fundraising_event">Fundraising Event</option>
                                    <option value="Donor_meeting">Donor Meeting</option>
                                    <option value="Cultural_event">Cultural Event</option>
                                    <option value="Career_fair">Career Fair</option>
                                    <option value="Job_fair">Job Fair</option>

                                    {/* Healthcare or Medical Purposes */}
                                    <option value="Medical_appointment">Medical Appointment</option>
                                    <option value="Health_screening">Health Screening</option>
                                    <option value="Wellness_check">Wellness Check</option>
                                    <option value="Vaccination_drive">Vaccination Drive</option>
                                    <option value="Blood_donation">Blood Donation</option>

                                    {/* Miscellaneous */}
                                    <option value="Facility_tour">Facility Tour</option>
                                    <option value="Temporary_access">Temporary Access</option>
                                    <option value="Other">Other</option>
                                </Field>
                                <ErrorMessage name="purposeOfVisit" component="div" className="error" />
                            </div>
   

                        <div className="form-group">
                            <label htmlFor="department">Department/Office Location</label>
                            <Field as="select" name="department">
                                <option value="">Select Department/Location</option>
                                {/* General Corporate/Academic Departments */}
                                <option value="Administration">Administration</option>
                                <option value="Human_resources">Human Resources</option>
                                <option value="Finance">Finance</option>
                                <option value="Accounting">Accounting</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Research_and_development">Research & Development</option>
                                <option value="IT">Information Technology (IT)</option>
                                <option value="Customer_service">Customer Service</option>
                                <option value="Product_management">Product Management</option>
                                <option value="Legal">Legal</option>
                                <option value="Compliance">Compliance</option>
                                <option value="Operations">Operations</option>
                                <option value="Security">Security</option>
                                <option value="Facilities_management">Facilities Management</option>
                                <option value="Logistics">Logistics</option>
                                <option value="Supply_chain">Supply Chain</option>
                                <option value="Quality Assurance & Control">Quality Assurance & Control</option>
                                <option value="Executive">Executive Office</option>
                                <option value="Business_development">Business Development</option>
                                <option value="Training">Training & Development</option>
                                <option value="Public_relations">Public Relations</option>
                                <option value="Environmental_health_safety">Environmental Health & Safety (EHS)</option>
                                <option value="Data_science">Data Science</option>
                                <option value="Analytics">Analytics</option>
                                <option value="Customer_success">Customer Success</option>
                                <option value="Creative">Creative/Design</option>
                                <option value="Content_management">Content Management</option>
                                <option value="Product_design">Product Design</option>
                                <option value="Project_management">Project Management</option>
                                <option value="Warehouse">Warehouse</option>

                                {/* Academic-Specific Departments */}
                                <option value="Admissions">Admissions</option>
                                <option value="Registrar">Registrar's Office</option>
                                <option value="Financial_aid">Financial Aid</option>
                                <option value="Academic_affairs">Academic Affairs</option>
                                <option value="Student_services">Student Services</option>
                                <option value="Research_labs">Research Labs</option>
                                <option value="Faculty_affairs">Faculty Affairs</option>
                                <option value="Library">Library</option>
                                <option value="Career_services">Career Services</option>
                                <option value="Housing">Housing & Residential Life</option>
                                <option value="Alumni_relations">Alumni Relations</option>

                                {/* School Departments */}
                                <option value="Elementary_school">Elementary School</option>
                                <option value="Middle_school">Middle School</option>
                                <option value="High_school">High School</option>
                                <option value="Special_education">Special Education</option>
                                <option value="Student_counseling">Student Counseling</option>
                                
                                {/* Location Options */}
                                <option value="Regional_office_1">Regional Office 1</option>
                                <option value="Regional_office_2">Regional Office 2</option>
                                <option value="Headquarters">Headquarters</option>
                                <option value="Main_campus">Main Campus</option>
                                <option value="Satellite_campus">Satellite Campus</option>
                            </Field>
                            <ErrorMessage name="department" component="div" className="error" />
                        </div>

                        <div className="form-group">
                        <label htmlFor="badgeType">Badge Type/Access Level</label>
                        <Field as="select" name="badgeType">
                            <option value="">Select Badge Type</option>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Staff">Staff</option>
                            <option value="Faculty">Temporary</option>
                            <option value="Alumni">Alumni</option>
                            <option value="Parent">Parent</option>
                            <option value="Volunteer">Volunteer</option>
                            <option value="Guest">Guest</option>
                            <option value="Vendor">Vendor</option>
                            <option value="Vip">VIP</option>
                            <option value="Contractor">Contractor</option>
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                            <option value="Executive">Executive</option>
                            <option value="Administrator">Administrator</option>
                            <option value="Intern">Intern</option>
                            <option value="Consultant">Consultant</option>
                            <option value="Temp">Temporary Staff</option>
                            <option value="Security">Security</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Cleaning">Cleaning Staff</option>
                            <option value="IT_support">IT Support</option>
                            <option value="Restricted_access">Restricted Access</option>
                            <option value="Visitor">Visitor</option>
                            <option value="Unrestricted">Interview</option>
                            <option value="General_access">General Access</option>
                            <option value="Limited_access">Limited Access</option>
                            <option value="Unrestricted">Unrestricted</option>
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
        <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Visitor Pass Generation. All Rights Reserved.</p>
    </footer>
    </div>
    );
};

export default VisitorPassForm;
