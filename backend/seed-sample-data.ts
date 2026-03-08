import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

// Fallback just in case, but prefer the env variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mern-v-01:8PO44kkfiprlJYwW@mern-cluster-v01.b3wso4e.mongodb.net/';

async function seedSamples() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB for seeding');

        const db = mongoose.connection.db;
        if (!db) {
            console.log("No DB connection available.");
            return;
        }

        const admin = await db.collection('users').findOne({ email: 'admin@care.com' });
        const doctor = await db.collection('users').findOne({ email: 'doctor@care.com' });
        const nurse = await db.collection('users').findOne({ email: 'nurse@care.com' });
        const lab = await db.collection('users').findOne({ email: 'lab@care.com' });

        if (!admin || !doctor || !nurse || !lab) {
            console.log('Default users not found. Check if the initial users seeded correctly.');
            return;
        }

        // 1. Add patient
        const patientData = {
            name: "John Doe Patient",
            email: "patient@care.com",
            password: admin.password,
            role: "Patient",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        let patient = await db.collection('users').findOne({ email: 'patient@care.com' });
        if (!patient) {
            const patientRes = await db.collection('users').insertOne(patientData);
            patient = { _id: patientRes.insertedId } as any;
            console.log('Created dummy patient');
        }

        // 2. Add Intakes (Triage queue + Intake Queue)
        const intakeData1 = {
            patientId: patient!._id,
            symptoms: ["Fever", "Cough", "Fatigue"],
            vitals: { bloodPressure: "120/80", heartRate: 85, temperature: 99.5 },
            priority: "ROUTINE",
            assignedDoctor: doctor._id,
            currentState: "READY_FOR_TRIAGE", // Dashboard & Triage queue
            stateHistory: [
                { fromState: "DRAFT", toState: "READY_FOR_TRIAGE", changedBy: patient!._id, timestamp: new Date() }
            ],
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const intakeData2 = {
            patientId: patient!._id,
            symptoms: ["Severe Chest Pain", "Shortness of Breath"],
            vitals: { bloodPressure: "155/95", heartRate: 110, temperature: 98.6 },
            priority: "EMERGENCY",
            assignedDoctor: doctor._id,
            currentState: "TRIAGED",
            stateHistory: [
                { fromState: "DRAFT", toState: "READY_FOR_TRIAGE", changedBy: nurse._id, timestamp: new Date() },
                { fromState: "READY_FOR_TRIAGE", toState: "TRIAGED", changedBy: doctor._id, timestamp: new Date() }
            ],
            version: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const int1Res = await db.collection('intakes').insertOne(intakeData1);
        const int2Res = await db.collection('intakes').insertOne(intakeData2);
        console.log('Created dummy intakes');

        // 3. Appointments
        const apt1 = {
            patientId: patient!._id,
            doctorId: doctor._id,
            appointmentDate: new Date(Date.now() + 86400000), // Tomorrow
            duration: 30,
            status: "SCHEDULED",
            notes: "Follow-up consultation",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const apt2 = {
            patientId: patient!._id,
            doctorId: doctor._id,
            appointmentDate: new Date(Date.now() - 86400000), // Yesterday
            duration: 60,
            status: "COMPLETED",
            notes: "Initial checkup",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await db.collection('appointments').insertMany([apt1, apt2]);
        console.log('Created dummy appointments');

        // 4. Treatment Plans
        const plan1 = {
            patientId: patient!._id,
            diagnoses: ["Viral Infection"],
            medications: [
                { name: "Ibuprofen", dosage: "400mg every 6 hours", isControlled: false }
            ],
            labTests: ["Complete Blood Count (CBC)"],
            procedures: [],
            version: 1,
            currentState: "ACTIVE",
            approvedBy: doctor._id,
            createdBy: doctor._id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await db.collection('treatmentplans').insertOne(plan1);
        console.log('Created dummy treatment plans');

        // 5. Lab Orders
        const lab1 = {
            intakeId: int2Res.insertedId,
            patientId: patient!._id,
            testName: "ECG",
            orderedByDoctor: doctor._id,
            labTechnician: lab._id,
            status: "ORDERED",
            orderedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const lab2 = {
            intakeId: int1Res.insertedId,
            patientId: patient!._id,
            testName: "Complete Blood Count",
            orderedByDoctor: doctor._id,
            labTechnician: lab._id,
            status: "RESULTS_UPLOADED",
            orderedAt: new Date(Date.now() - 3600000),
            processedAt: new Date(Date.now() - 1800000),
            resultsUploadedAt: new Date(),
            resultsData: { wbc: "10.2 thou/mm3", rbc: "4.5 mil/mm3" },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await db.collection('laborders').insertMany([lab1, lab2]);
        console.log('Created dummy lab orders');

        // 6. Audit logs
        const audit1 = {
            action: "UPDATE",
            entityType: "INTAKE",
            entityId: int2Res.insertedId,
            userId: nurse._id,
            details: { priority: "EMERGENCY" },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const audit2 = {
            action: "CREATE",
            entityType: "APPOINTMENT",
            entityId: null, // Just placeholder
            userId: admin._id,
            details: { manual_override: true },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await db.collection('auditlogs').insertMany([audit1, audit2]);
        console.log('Created dummy audit logs');

        console.log('\n✅ All sample data seeded successfully!');

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedSamples();
