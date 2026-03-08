# Appointments UI Implementation

Create and integrate a complete **Appointments system** for the healthcare management dashboard.

This feature should include backend data seeding, a dynamic UI component, and role-based display logic.

---

# 1. Seed Realistic Appointment Data

Create a script:

seed-appointments.ts

Responsibilities:

- Generate realistic patient profiles
- Insert dummy appointment records
- Ensure relational integrity between patients and appointments

Example Patients:

- Eleanor Vance
- Marcus Johnson
- Sophia Chen

---

# 2. Create Mixed Appointment Data

Generate sample appointments with different statuses.

Required appointment types:

1. **Scheduled Appointment**
   - Cardiology appointment scheduled for tomorrow

2. **Scheduled Appointment**
   - Annual physical checkup

3. **Completed Appointment**
   - Occurred 2 days ago
   - Includes doctor's notes

4. **No Show Appointment**
   - Patient missed appointment
   - Occurred one week ago

Statuses:

- SCHEDULED
- COMPLETED
- CANCELLED
- NO_SHOW

---

# 3. Build Frontend UI Component

Create:

AppointmentList.tsx

Responsibilities:

- Fetch data from backend endpoint:

/api/v1/appointments

- Render appointments in a list of cards
- Display appointment details such as:

Patient Name  
Doctor Name  
Appointment Date  
Status  
Notes (if completed)

---

# 4. UI Status Indicators

Use pill-style status badges with colors:

Scheduled → Blue  
Completed → Green  
Cancelled → Red  
No Show → Yellow

Example:

[Scheduled]  
[Completed]  
[No Show]

---

# 5. Role-Based Display Logic

The component should detect the current logged-in user role.

Behavior:

Doctor View:
- Show patient name on appointment card

Patient View:
- Show doctor name on appointment card

This ensures context-aware UI display.

---

# 6. App Routing Integration

Update:

App.tsx

Replace the placeholder component:

<Appointments />

With the new dynamic component:

AppointmentList.tsx

Add it to the sidebar route:

/appointments

---

# Expected Result

When clicking the **Appointments** tab in the sidebar:

- Users see realistic appointment data
- Cards show correct patient or doctor name depending on role
- Status badges display with color-coded states
- Past and upcoming appointments appear correctly