import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const MONGODB_URI = 'mongodb+srv://mern-v-01:8PO44kkfiprlJYwW@mern-cluster-v01.b3wso4e.mongodb.net/';

async function checkDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const db = mongoose.connection.db;
        const usersCollection = db?.collection('users');
        if (!usersCollection) {
            console.log('No users collection');
            return;
        }

        const users = await usersCollection.find({}).toArray();
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            console.log(`User: ${user.email}, Role: ${user.role}`);

            // Check against 'Password123'
            const isMatch1 = await bcrypt.compare('Password123', user.password);
            console.log(`- Password123 matches: ${isMatch1}`);

            // Check against 'Admin@123'
            const isMatch2 = await bcrypt.compare('Admin@123', user.password);
            console.log(`- Admin@123 matches: ${isMatch2}`);

            // Print out the hash
            console.log(`- Hash: ${user.password}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkDatabase();
