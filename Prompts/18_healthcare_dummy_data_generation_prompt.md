Create a script that generates and inserts realistic dummy data into a healthcare management system database.

The database should populate the following modules:

1. Patients
- Insert at least 5 sample patients
- Include fields like id, name, email, phone, date_of_birth, gender
- Assign each patient to a doctor

2. Dashboard / Intake Queue
- Insert at least 3 intake records
- Include different triage priorities such as Routine, Urgent, Emergency

3. Triage Queue
- Generate triage state history for each intake
- Include states like waiting, triaged, doctor_assigned, completed

4. Appointments
- Insert both past and upcoming appointments
- Include appointment date, doctor, patient, status

5. Treatment Plans
- Insert active treatment plans
- Include diagnoses and medications

Example:
Diagnosis: Viral Infection
Medication: Ibuprofen

6. Lab Workflow
- Insert lab orders such as ECG, CBC, X-Ray
- Include order status (pending, completed)
- Add dummy results for completed labs

7. Audit Logs
- Simulate system activity logs such as:
  - Nurse triaging a patient
  - Admin creating an appointment
  - Doctor updating treatment plan

Requirements:
- Use realistic healthcare data
- Ensure relational integrity between tables
- Use UUIDs or IDs where necessary
- Make the script runnable for local development
- Output should populate the database with test data for UI testing

Return the script ready to run in a development environment.