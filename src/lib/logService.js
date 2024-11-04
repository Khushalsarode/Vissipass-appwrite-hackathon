// src/lib/logService.js

import { functions } from './appwrite';

export const getLogs = async (userId) => {
    try {
        const response = await functions.createExecution('getUserLogs', JSON.stringify({ userId }));
        const logs = JSON.parse(response.stdout);
        return logs;
    } catch (error) {
        console.error("Error fetching logs:", error);
        return [];
    }
};
