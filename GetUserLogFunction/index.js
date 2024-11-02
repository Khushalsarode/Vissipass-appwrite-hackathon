const sdk = require('node-appwrite');

module.exports = async function (req, res) {
    const client = new sdk.Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const users = new sdk.Users(client);

    try {
        const result = await users.listLogs(req.payload.userId, []);
        res.json(result);
    } catch (error) {
        res.json({ error: error.message });
    }
};
