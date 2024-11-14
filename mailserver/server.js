const express = require('express');
const { Resend } = require('resend');
const cors = require('cors'); 

const dotenv = require('dotenv');
dotenv.config();
const resendapikey = new Resend(process.env.RESENDEMAILAPIKEY);
// Initialize Resend with your API key
const resend = new Resend(resendapikey); // Replace with your actual Resend API key

// Create an Express server
const app = express();
const port = 5000;

app.use(cors());

// Middleware to parse JSON body data
app.use(express.json());

// Email template HTML content (ensure it's a string)
const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visitor Pass</title>
    <style>
        /* General Reset */
        body, h1, h2, p, table {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
        }
        body {
            background-color: #f4f4f4;
            padding: 0;
            font-size: 16px;
        }
        img {
            max-width: 100%;
            height: auto;
        }

        /* Container */
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            font-size: 16px;
        }

        /* Header */
        .header {
            background-color: #007BFF;
            color: #ffffff;
            padding: 30px;
            text-align: center;
            position: relative;
        }
        .header img {
            max-width: 120px;
            margin-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }

        /* Content */
        .content {
            padding: 20px;
            color: #333333;
        }
        .content h2 {
            margin: 0;
            font-size: 22px;
            text-align: center;
            margin-bottom: 10px;
        }

        /* Profile Photo */
        .profile-photo {
            display: block;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 3px solid #007BFF;
            margin: 0 auto 20px;
        }

        /* Info Container */
        .info-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .info-container div {
            flex: 1;
            margin: 0 10px;
        }

        /* Table */
        .table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
            background-color: #f9f9f9;
            border-radius: 5px;
            overflow: hidden;
        }
        .table th, .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #dddddd;
        }
        .table th {
            background-color: #007BFF;
            color: white;
            font-weight: 500;
        }
        .table tr:hover {
            background-color: #f1f1f1;
        }

        /* QR Code */
        .qr-code {
            text-align: center;
            margin: 20px 0;
        }

        /* Footer */
        .footer {
            padding: 15px;
            text-align: center;
            background-color: #f8f8f8;
            font-size: 14px;
            color: #777777;
            border-top: 1px solid #dddddd;
        }

        /* Media Queries for Responsiveness */
        @media screen and (max-width: 600px) {
            .header h1 {
                font-size: 24px;
            }

            .profile-photo {
                width: 80px;
                height: 80px;
            }

            .content h2 {
                font-size: 20px;
            }

            .info-container {
                flex-direction: column;
                align-items: flex-start;
            }

            .info-container div {
                margin: 10px 0;
            }

            .table th, .table td {
                font-size: 14px;
            }

            .table {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="company_logo_url" alt="Company Logo">
            <h1> {company} </h1>
        </div>
        <div class="content">
            <img src="{profilePhoto}" alt="Profile Photo" class="profile-photo">
            <h2>Visitor Pass</h2>

            <div class="info-container">
                <div>
                    <p><strong>Name:</strong> {firstName} {lastName}</p>
                    <p><strong>Employee/Student ID:</strong> {employeeId}</p>
                    <p><strong>Pass ID:</strong> {PassId}</p>
                </div>
                <div class="qr-code">
                    <img src="{qrCodeUrl}" alt="QR Code" style="width: 150px; border: 1px solid #dddddd; border-radius: 5px;">
                </div>
            </div>

            <table class="table">
                <tr>
                    <th>Date of Visit</th>
                    <th>Purpose</th>
                    <th>Department</th>
                    <th>Badge Type</th>
                </tr>
                <tr>
                    <td>{dateOfVisit}</td>
                    <td>{purpose}</td>
                    <td>{department}</td>
                    <td>{badgeType}</td>
                </tr>
            </table>
        </div>
        <div class="footer">
            &copy; <span id="year"></span> Company Name. All rights reserved.
        </div>
    </div>

    <script>
        document.getElementById('year').innerText = new Date().getFullYear();
    </script>
</body>
</html>`;

// Endpoint to send email
app.post('/send-email', async (req, res) => {
  const { to, subject, company, firstName, lastName, userImage, employeeId, $id, qrCodeUrl, dateOfVisit, purpose, department, badgeType } = req.body;

  try {
    // Ensure emailTemplate is a string before using .replace()
    let personalizedEmail = String(emailTemplate)
      .replace("{company}", company)
      .replace("{firstName}", firstName)
      .replace("{lastName}", lastName)
      .replace("{profilePhoto}", userImage)
      .replace("{employeeId}", employeeId)
      .replace("{PassId}", $id)
      .replace("{qrCodeUrl}", qrCodeUrl)
      .replace("{dateOfVisit}",new Date (dateOfVisit).toLocaleString())
      .replace("{purpose}", purpose)
      .replace("{department}", department)
      .replace("{badgeType}", badgeType);

    // Sending the email via Resend API
    const { data, error } = await resend.emails.send({
      from: 'Vissipass <Vissipass@aiforgetech.co>',
      to: [to],
      subject: subject || 'Visitor Pass',
      html: personalizedEmail,  // Use the dynamically updated template
    });

    if (error) {
      return res.status(500).json({ error });
    }

    // If email is sent successfully, return the response data
    return res.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
