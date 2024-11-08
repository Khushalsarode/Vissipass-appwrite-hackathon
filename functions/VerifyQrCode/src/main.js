import { Client, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID;
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const collectionId = process.env.APPWRITE_COLLECTION_ID_USERDATAPASS;
  const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT;
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  
  const databases = new Databases(client);
  // Extract the ID parameter from the request
  const query = new URL(req.url, `https://${req.headers.host}`).searchParams;
  const passId = JSON.parse(req.body ?? '{}').id;


  
  // Check if the pass ID is provided
  if (!passId) {
    return res.text('Missing Pass ID', 400); // Use res.text() to send a response with status code
  }

  try {
    // Fetch the document corresponding to the pass ID from your database
    const document = await databases.getDocument(
      databaseId,
      collectionId, // Replace with your collection ID
      passId
    );

    // Check if the document exists
    if (!document) {
      return res.text('Visitor Pass Not Found', 404); // Use res.text() to send a response with status code
    }

    // Implement your verification logic here
    // For example, check if the pass is valid or has been used
    if (document.isUsed) {
      return res.text('This Visitor Pass Has Already Been Used', 403); // Use res.text() to send a response with status code
    }

    // Mark the pass as used (or perform other verification steps)
    await databases.updateDocument(
      databaseId,
      collectionId,
      passId,
      { isUsed: true } // Assuming you have an isUsed field in your document
    );

    // Log successful verification
    log(`Visitor pass ${passId} verified successfully`);

    // Respond with success message
    return res.text('Visitor Pass Verified Successfully', 200); // Use res.text() to send a response with status code
  } catch (err) {
    console.error('Error verifying pass:', err);
    return res.text("verifying Visitor Pass Doesn't Exist!", 500); // Use res.text() to send a response with status code
  }
};
