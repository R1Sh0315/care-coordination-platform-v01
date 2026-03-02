import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { RuleEngineService } from './src/services/ruleEngine.service';
import { AuthService } from './src/services/auth.service';

// Load environment variables
dotenv.config(); // Looks in the root of the project by default

import app from './src/app';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/care_platform';

// MongoDB Connection
mongoose.set('strictQuery', false);
mongoose
    .connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB Successfully! 🛡️');
        try {
            await RuleEngineService.seedDefaultRules();
            console.log('Triage rules checked/seeded ✅');
            await AuthService.seedUsers();
            console.log('Initial users checked/seeded ✅');
        } catch (seedErr) {
            console.error('Seeding error ⚠️:', seedErr);
        }
    })
    .catch((err) => {
        console.error('MongoDB Connection Error! ⚠️', err);
        process.exit(1);
    });

// Start the Express Server
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} 🚀`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
