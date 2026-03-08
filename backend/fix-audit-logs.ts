import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mern-v-01:8PO44kkfiprlJYwW@mern-cluster-v01.b3wso4e.mongodb.net/';

async function fixAuditLogs() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const db = mongoose.connection.db;
        if (!db) {
            console.log("No DB connection available.");
            return;
        }

        const auditLogs = await db.collection('auditlogs').find({}).toArray();
        for (const log of auditLogs) {
            const updates: any = {};
            if (log.userId) {
                updates.performedBy = log.userId;
                // We'll unset userId below
            }
            if (!log.entityId || log.entityId === null) {
                updates.entityId = new mongoose.Types.ObjectId(); // Mock entity ID
            }
            if (!log.timestamp) {
                updates.timestamp = log.createdAt || new Date();
            }

            if (Object.keys(updates).length > 0) {
                await db.collection('auditlogs').updateOne(
                    { _id: log._id },
                    {
                        $set: updates,
                        $unset: { userId: "" }
                    }
                );
                console.log(`Updated audit log ${log._id}`);
            }
        }
        console.log('Finished fixing audit logs.');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

fixAuditLogs();
