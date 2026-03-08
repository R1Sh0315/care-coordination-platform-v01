# Patient Appointment Booking System

The Appointments system has been upgraded to allow **patients to book their own appointments** based on **real-time doctor availability**.

This feature includes a new booking UI, smart slot availability logic, and role-based access control.

---

# 1. Patient Booking UI

Create a new screen:

BookAppointment.tsx

Features:

Patients can:

- Select a **Doctor**
- Choose a **Date** using a calendar
- Select an available **30-minute time slot**

Example slots:

10:00 AM  
10:30 AM  
11:00 AM  
11:30 AM

---

# 2. Smart Availability Logic

The booking system checks the database before displaying available slots.

Rules:

- If a slot is already booked, it is **disabled and greyed out**
- Only **future time slots** are displayed
- Past time slots cannot be booked

Example logic:

Check existing appointments for:

Doctor ID  
Selected Date  
Time Slot

If a match exists → mark slot unavailable.

---

# 3. Role-Based Access

The system behaves differently depending on the user role.

## Patient View

Patients can:

- View their own appointments
- Book new appointments

UI elements:

"Book New Appointment" button on dashboard.

---

## Doctor / Admin View

Doctors and administrators can:

- View all appointments
- Monitor schedules
- See patient appointment details

---

# 4. Backend Integration

Appointments are fetched and stored through:

/api/v1/appointments

Booking requests create a new appointment record containing:

- patientId
- doctorId
- appointmentDate
- timeSlot
- status

Example status:

SCHEDULED  
COMPLETED  
CANCELLED  
NO_SHOW

---

# 5. Expected Result

When a patient logs in:

- They see a **Book New Appointment** button
- They can select a doctor, date, and time slot
- Already booked slots are disabled
- Past slots cannot be selected

Doctors and Admins can view all appointments across the system.