# Appointment Cancel & Reschedule System

The appointment system has been upgraded to support **rescheduling and cancellation** for both patients and doctors.  
The implementation also includes **mutual availability checks** to prevent double-booking for either party.

---

# 1. Mutual Availability Logic (Backend)

The system now checks **both doctor and patient schedules** before allowing a booking or reschedule.

## Smart Slot Calculation

The API:

GET /appointments/available-slots

Now verifies:

- Doctor availability
- Patient availability

If the patient already has another appointment at that time, the slot will not appear even if the doctor is free.

Example scenario:

Doctor free at 10:30  
Patient already booked at 10:30  

Result:

Slot hidden from availability list.

---

## Race Condition Prevention

The `checkAvailability` service was updated to enforce availability checks during the final database save.

This prevents race conditions where two users attempt to book the same slot simultaneously.

Checks include:

- doctorId
- patientId
- appointmentDate
- timeSlot

---

# 2. Rescheduling & Cancellation

## Reschedule Endpoint

New API route:

PATCH /appointments/:id/reschedule

Functionality:

- Updates appointment date and time
- Keeps existing doctor assignment
- Preserves doctor notes
- Maintains appointment history

---

## Authorization Rules

### Patient Permissions

Patients can:

- Cancel their own appointments
- Reschedule their own appointments

They cannot modify appointments belonging to other patients.

---

### Doctor / Admin Permissions

Doctors and Admins can:

- View all appointments
- Cancel appointments
- Reschedule appointments for patients

---

# 3. Unified Booking UI

The component:

BookAppointment.tsx

Now supports **two modes**:

## Booking Mode

Used when creating a new appointment.

Behavior:

- Creates a new appointment record.

---

## Reschedule Mode

Triggered when clicking **Reschedule** on an existing appointment.

Behavior:

- Loads existing appointment data
- Updates date/time instead of creating a new record.

---

# 4. Enhanced Appointment List UI

Appointment cards now include action buttons.

Example:

[ Reschedule ] [ Cancel ]

---

## Cancel Action

When clicking **Cancel**:

- A confirmation prompt appears
- Appointment status updates to:

CANCELLED

- The time slot becomes available for booking again.

---

# 5. Status Workflow

Appointment statuses include:

SCHEDULED  
COMPLETED  
CANCELLED  
NO_SHOW

These statuses are displayed with color-coded UI badges.

Example:

Scheduled → Blue  
Completed → Green  
Cancelled → Red  
No Show → Yellow

---

# Expected Result

Patients:

- Can cancel or reschedule their own appointments.
- Cannot double-book themselves.

Doctors/Admins:

- Can manage all appointments.

The system guarantees:

- No doctor double-booking
- No patient double-booking
- Real-time availability updates.