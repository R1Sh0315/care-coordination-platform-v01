import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/care_platform';

async function seedAppointments() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB for seeding appointments');

        const db = mongoose.connection.db;
        if (!db) {
            console.log("No DB connection available.");
            return;
        }

        const admin = await db.collection('users').findOne({ email: 'admin@care.com' });
        const doctor = await db.collection('users').findOne({ email: 'doctor@care.com' });

        if (!admin || !doctor) {
            console.log('Default users not found.');
            return;
        }

        // 1. Add realistic patients
        const patientsData = [
            {
                name: "Eleanor Vance",
                email: "eleanor.vance@example.com",
                password: admin.password,
                role: "Patient",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Marcus Johnson",
                email: "mjohnson88@example.com",
                password: admin.password,
                role: "Patient",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Sophia Chen",
                email: "sophia.chen@example.com",
                password: admin.password,
                role: "Patient",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const insertedPatients = [];
        for (const p of patientsData) {
            let existing = await db.collection('users').findOne({ email: p.email });
            if (!existing) {
                const res = await db.collection('users').insertOne(p);
                insertedPatients.push({ _id: res.insertedId, name: p.name });
            } else {
                insertedPatients.push({ _id: existing._id, name: p.name });
            }
        }
        console.log(`Created/Refreshed ${insertedPatients.length} realistic patients`);

        // 2. Add Appointments
        const now = Date.now();
        const appointments = [
            {
                patientId: insertedPatients[0]._id, // Eleanor
                doctorId: doctor._id,
                appointmentDate: new Date(now + 1 * 60 * 60 * 1000), // In 1 hour
                duration: 45,
                status: "SCHEDULED",
                notes: "Cardiology follow-up. Please ensure recent ECG is attached.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                patientId: insertedPatients[1]._id, // Marcus
                doctorId: doctor._id,
                appointmentDate: new Date(now + 24 * 60 * 60 * 1000), // Tomorrow
                duration: 30,
                status: "SCHEDULED",
                notes: "Annual physical examination.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                patientId: insertedPatients[2]._id, // Sophia
                doctorId: doctor._id,
                appointmentDate: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                duration: 60,
                status: "COMPLETED",
                notes: "Complained of chronic migraines. Prescribed medication.",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                patientId: insertedPatients[0]._id, // Eleanor
                doctorId: doctor._id,
                appointmentDate: new Date(now - 7 * 24 * 60 * 60 * 1000), // 1 week ago
                duration: 30,
                status: "NO_SHOW",
                notes: "Patient did not answer call.",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await db.collection('appointments').insertMany(appointments);
        console.log('Created surprise appointments!');

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedAppointments();
