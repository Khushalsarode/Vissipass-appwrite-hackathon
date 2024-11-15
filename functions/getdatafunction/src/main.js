import { Client, Users, Storage, Databases, Functions } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // Initialize the Appwrite client
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT || '') // Appwrite endpoint
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID || '') // Project ID
    .setKey(req.headers['x-appwrite-key'] ?? ''); // API Key from headers

  const users = new Users(client);
  const storage = new Storage(client);
  const databases = new Databases(client);
  const functions = new Functions(client);



  try {
    // Fetch all users
    const response = await users.list();
    const bucketsid = process.env.REACT_APP_APPWRITE_STORAGE_BUCKET_ID;
    const QRbucketid = process.env.REACT_APP_APPWRITE_STORAGE_BUCKET_ID_QR;
    const databaseid = process.env.REACT_APP_APPWRITE_DATABASE_ID;

    const collectioninitial = process.env.REACT_APP_APPWRITE_COLLECTION_ID_INITIALUSERSDATA;
    const archievecollection = process.env.REACT_APP_APPWRITE_COLLECTION_ID_ARCHIEVEDUSERSDATA;
    const userdatapass = process.env.REACT_APP_APPWRITE_COLLECTION_ID_USERSDATA;

    const functionid = process.env.REACT_APP_APPWRITE_FUNCTION_ID;
    const qrfunctionid = process.env.REACT_APP_APPWRITE_FUNCTION_ID_QR;
    
    
    //User INFO Data
    // Extract user ID and name
    const userInfo = response.users.map(user => ({
      id: user.$id,
      name: user.name,
    }));


    //Storage Bucket listing
    const buckets = await storage.listBuckets(
      //[], // queries (optional)
     // '<SEARCH>' // search (optional)
  );

  //Storage Bucket Files listing
  const bucketsfiles = await storage.listFiles(
    bucketsid // bucketId
    //[], // queries (optional)
    //'<SEARCH>' // search (optional)
);

//Storage Bucket Files listing
const QRbucketsfiles = await storage.listFiles(
  QRbucketid // bucketId
  //[], // queries (optional)
  //'<SEARCH>' // search (optional)
);

//Database listing
const database = await databases.list(
  //[], // queries (optional)
  //'<SEARCH>' // search (optional)
);


//Database Documents listing
//LIst ALL Documents in the Database
//const documentsInfo = documents.databases.map(user => ({}));
const collectionId = await databases.listCollections(
  databaseid // databaseId
 // [], // queries (optional)
 // '<SEARCH>' // search (optional)
);

//Listing all the documents in the collection initialusersdata
//Database Documents listing
const documents = await databases.listDocuments(
  databaseid, // databaseId
  collectioninitial, // collectionId
  //[], // filters (optional)
);

//Listing all the documents in the collection archievedusersdata
//Database Documents listing
const documentsarchieve = await databases.listDocuments(
  databaseid, // databaseId
  archievecollection, // collectionId
  //[], // filters (optional)
);

//Listing all the documents in the collection usersdata
//Database Documents listing
const documentsuserdata = await databases.listDocuments(
  databaseid, // databaseId
  userdatapass, // collectionId
  //[], // filters (optional)
);





//LIST FUNCTIONS
const listfunctions  = await functions.list(
  //[], // queries (optional)
  //'<SEARCH>' // search (optional)
);

//LIST FUNCTIONS EXECUTIONS getdatafunction
const listfunctionexec = await functions.listExecutions(
  functionid, // functionId
  //[], // queries (optional)
  //'<SEARCH>' // search (optional)
);

//LIST FUNCTIONS EXECUTIONS QRcodeverifyfunction
const listfunctionexecqr = await functions.listExecutions(
  qrfunctionid, // functionId
  //[], // queries (optional)
  //'<SEARCH>' // search (optional)
);





  

    // Log the total number of users
    log(`Total users: ${response.total}`);
    log(`Total buckets: ${buckets.total}`);
    log(`Total files: ${bucketsfiles.total}`);
    log(`Total Databases: ${database.total}`);
    log(`Total Documents: ${documents.total}`);
    log(`Total Collections: ${collectionId.total}`);
    log(`Total Functions: ${listfunctions.total}`);
    log(`Total Functions Executions: ${listfunctionexec.total}`);
    log(`Total Functions Executions QR: ${listfunctionexecqr.total}`);
    log(`Total Documents Archieved: ${documentsarchieve.total}`);
    log(`Total Documents UsersData: ${documentsuserdata.total}`);
    log(`Total QR Files: ${QRbucketsfiles.total}`);


    // Return the user info in the response JSON
    return res.json({
      totalUsers: response.total,
      users: userInfo,
      totalBuckets: buckets.total,
      //result: buckets,
      bucketsfiles: bucketsfiles.total,
      //database: database,
      database: database.total,
      //documents: documentsInfo, 
      documents: documents.total, 
      //collectionId: collectionId,
      collectionId: collectionId.total,
      totalfunctions: listfunctions.total,
      //functions: listfunctionexec,
      getdataremote: listfunctionexec.total,
      //functions: listfunctionexecqr,
      getqrdata: listfunctionexecqr.total,
      //documentsarchieve: documentsarchieve,
      documentsarchieve: documentsarchieve.total,
      //documentsuserdata: documentsuserdata,
      documentsuserdata: documentsuserdata.total,
      //QRbucketsfiles: QRbucketsfiles,
      QRbucketsfiles: QRbucketsfiles.total,
    });
  } catch (err) {
    // Log the error message for debugging
    error("Could not retrieve users: " + err.message);
    return res.json({ error: "Server Error: Could not retrieve users" });
  }
};
