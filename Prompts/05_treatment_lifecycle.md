# Appointment Scheduling Engine

## Prompt Used
Implement Treatment Plan Lifecycle 
for Care Coordination platform.

Stack:
Node.js + Express + TypeScript + MongoDB.

---------------------------------------
1️⃣ STATES
---------------------------------------

DRAFT → REVIEW → APPROVED → ACTIVE → MODIFIED → CLOSED

---------------------------------------
2️⃣ MODEL
---------------------------------------

Fields:
- patientId
- diagnoses (array)
- medications (array)
- labTests (array)
- procedures (array)
- version
- currentState
- stateHistory

---------------------------------------
3️⃣ RULES
---------------------------------------

- Only Doctor can create DRAFT
- If medication includes "Controlled Substance"
  THEN require Senior Doctor approval
- Only Senior Doctor can APPROVE
- ACTIVE plan cannot be deleted
- MODIFIED must increment version

---------------------------------------
4️⃣ SERVICE
---------------------------------------

TreatmentService:
- createPlan()
- updatePlan()
- transitionState()
- validateTransition()
- incrementVersion()

---------------------------------------
5️⃣ AUDIT
---------------------------------------

Every modification must:
- Log change
- Store previous version snapshot

Deliver complete lifecycle enforcement.
Strict transition guard.
Enterprise-grade validation.

## Why Scheduling Module?
- Prevent double booking
- Simulate real-world healthcare coordination
- Demonstrate concurrency validation
- Enforce role-based booking restrictions

## Architecture Decisions
- AppointmentService handles business logic
- Doctor availability check before saving
- Overlap detection using time range comparison
- Status lifecycle enforced (SCHEDULED → COMPLETED)

## Iterations
- Added overlap guard logic
- Added cancellation validation
- Added future-date validation
- Added race-condition prevention check
- Added optional reminder simulation