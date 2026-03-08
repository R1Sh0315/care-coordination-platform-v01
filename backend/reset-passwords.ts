import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const MONGODB_URI = 'mongodb+srv://mern-v-01:8PO44kkfiprlJYwW@mern-cluster-v01.b3wso4e.mongodb.net/';

async function resetPasswords() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const db = mongoose.connection.db;
        const usersCollection = db?.collection('users');
        if (!usersCollection) {
            console.log('No users collection');
            return;
        }

        const newHash = await bcrypt.hash('Password123', 10);
        console.log('New hash generated:', newHash);

        const result = await usersCollection.updateMany(
            {},
            { $set: { password: newHash } }
        );

        console.log(`Updated ${result.modifiedCount} users to use 'Password123' as password`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

resetPasswords();
