# Triage Queue Implementation Prompt

Create and implement a fully functional **Triage Queue system** for a healthcare management dashboard.

The implementation should include the following improvements and features.

## 1. Frontend Component

Create a React component:

TriageList.tsx

Responsibilities:
- Display patients waiting in the triage queue
- Filter intakes where state is:
  - READY_FOR_TRIAGE
  - TRIAGED
- Render triage cards for each patient

Each triage card should display:
- Patient Name
- Intake Priority (Routine / Emergency)
- Intake Time
- Current Triage Status

## 2. Real-Time Vitals Display

Inside each triage card show key vitals:

- Blood Pressure
- Heart Rate
- Temperature

These values should be pulled from the intake records or associated vitals data.

Example UI layout:

Patient Name  
Priority: Emergency  

Vitals
- BP: 120/80
- HR: 78 bpm
- Temp: 98.6°F

## 3. Routing Integration

Update App.tsx so that the Triage Queue tab renders the new component.

Steps:
- Remove the existing placeholder view
- Import TriageList.tsx
- Attach it to the sidebar navigation route

Route example:

/triage

## 4. Backend Fix

Update the backend intake service so patient data is included in list responses.

File:

backend/src/services/intake.service.ts

Problem:
The /intakes list endpoint was not populating patient references.

Solution:
Use populate() on the patientId field when fetching intake records so the UI receives full patient data.

Example:

populate('patientId')

This ensures the frontend can display the correct patient name instead of showing "Unknown Patient".

## 5. Expected Result

After implementation:

- Clicking the **Triage Queue** tab in the sidebar loads real patient records.
- Dummy patients (Routine and Emergency) appear in the queue.
- Patient names are correctly displayed.
- Vital signs are visible directly in the triage cards.