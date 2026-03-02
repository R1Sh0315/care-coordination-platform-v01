# Appointment Scheduling Engine

## Prompt Used

I need a basic Appointment Scheduling module 
for a healthcare platform.

Stack:
Node.js + Express + TypeScript + MongoDB.

---------------------------------------
1️⃣ FEATURES
---------------------------------------

- Doctor availability calendar
- Prevent double booking
- Appointment states:
    SCHEDULED → CANCELLED → COMPLETED → NO_SHOW

---------------------------------------
2️⃣ APPOINTMENT MODEL
---------------------------------------

Fields:
- patientId
- doctorId
- appointmentDate
- duration (minutes)
- status
- createdAt

---------------------------------------
3️⃣ VALIDATIONS
---------------------------------------

- Doctor must not have overlapping appointment
- Cannot book in the past
- Cancelled appointment cannot be modified
- Only Receptionist/Admin can create appointment

---------------------------------------
4️⃣ LOGIC
---------------------------------------

Create AppointmentService:
- createAppointment()
- checkDoctorAvailability()
- cancelAppointment()
- completeAppointment()

---------------------------------------
5️⃣ BONUS
---------------------------------------

- Add waitlist logic
- Add slot-based availability
- Add appointment reminders (cron simulation)

Deliver clean architecture.
Use proper HTTP status codes.
Prevent race conditions.