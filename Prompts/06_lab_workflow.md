# Treatment Plan Lifecycle

## Prompt Used
Implement a simple Lab Workflow module.

Stack:
Node.js + Express + TypeScript + MongoDB.

---------------------------------------
1️⃣ LAB LIFECYCLE
---------------------------------------

ORDERED → SAMPLE_COLLECTED → PROCESSING → RESULTS_UPLOADED → REVIEWED

---------------------------------------
2️⃣ MODEL
---------------------------------------

Fields:
- intakeId
- orderedByDoctor
- labTechnician
- status
- resultDocumentUrl
- reviewedByDoctor
- timestamps per stage

---------------------------------------
3️⃣ RULES
---------------------------------------

- Only Doctor can ORDER lab
- Only LabTechnician can move to PROCESSING
- Only LabTechnician can upload results
- Only Doctor can mark REVIEWED

---------------------------------------
4️⃣ SERVICE
---------------------------------------

LabService:
- orderLab()
- updateStatus()
- uploadResults()
- reviewResults()

---------------------------------------
5️⃣ BONUS
---------------------------------------

- Add SLA tracking
- Add delayed alert simulation
- Add filter: pending lab results

Deliver complete state enforcement.

## Why Lifecycle Enforcement?
- Ensure controlled medical approval process
- Prevent unauthorized medication approvals
- Enable version tracking of treatment plans
- Support compliance and audit needs

## Architecture Decisions
- Enum-based state management
- Strict transition validation
- Version increment on modification
- Senior Doctor approval for controlled substances
- Snapshot storage before updates

## Iterations
- Added version history tracking
- Added approval role validation
- Added prevention of deletion when ACTIVE
- Added audit log integration
- Added transition guard utility