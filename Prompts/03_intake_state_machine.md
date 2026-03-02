# Patient Intake State Machine

## Prompt Used
I am building a Care Coordination & Clinical Workflow Platform backend 
using:

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)

I need a production-grade Patient Intake State Machine implementation.

-----------------------------------------
1️⃣ INTAKE LIFECYCLE STATES
-----------------------------------------

Implement the following lifecycle:

DRAFT → SUBMITTED → TRIAGE_PENDING → TRIAGED → ASSIGNED_TO_DOCTOR → CONSULTED → TREATMENT_STARTED → COMPLETED → FOLLOW_UP_REQUIRED

Use a TypeScript enum for states.

-----------------------------------------
2️⃣ INTAKE MODEL
-----------------------------------------

Create a Mongoose schema:

- patientId (ObjectId ref User)
- symptoms (string[])
- vitals:
    - bloodPressure
    - heartRate
    - temperature
- priority (LOW | MEDIUM | HIGH)
- assignedDoctor (ObjectId ref User)
- currentState (enum)
- stateHistory (array of objects):
    - fromState
    - toState
    - changedBy (UserId)
    - timestamp
- createdAt
- updatedAt

-----------------------------------------
3️⃣ STATE TRANSITION RULES
-----------------------------------------

Implement strict transition validation.

Allowed transitions:

DRAFT → SUBMITTED
SUBMITTED → TRIAGE_PENDING
TRIAGE_PENDING → TRIAGED
TRIAGED → ASSIGNED_TO_DOCTOR
ASSIGNED_TO_DOCTOR → CONSULTED
CONSULTED → TREATMENT_STARTED
TREATMENT_STARTED → COMPLETED
COMPLETED → FOLLOW_UP_REQUIRED

Invalid transitions must throw error.

-----------------------------------------
4️⃣ ROLE RESTRICTIONS
-----------------------------------------

Only specific roles can move to certain states:

- Receptionist: DRAFT → SUBMITTED
- Nurse: TRIAGE_PENDING → TRIAGED
- Doctor: ASSIGNED_TO_DOCTOR → CONSULTED
- Doctor: CONSULTED → TREATMENT_STARTED
- Doctor: TREATMENT_STARTED → COMPLETED
- Admin: can override any transition
- ComplianceOfficer: cannot change states

Enforce role validation inside service layer.

-----------------------------------------
5️⃣ SERVICE LAYER
-----------------------------------------

Create:

IntakeService with methods:

- createIntake()
- updateIntake()
- transitionState(intakeId, targetState, user)
- validateTransition(currentState, targetState)
- logStateChange()

Business logic must not be inside controller.

-----------------------------------------
6️⃣ CONTROLLERS & ROUTES
-----------------------------------------

Routes:

POST /intakes → create intake
GET /intakes/:id → get intake
PATCH /intakes/:id/transition → move to next state
GET /intakes → list all (with filters)

All routes protected by authentication middleware.

-----------------------------------------
7️⃣ VALIDATION REQUIREMENTS
-----------------------------------------

- Cannot move to TRIAGED unless vitals are present
- Cannot move to ASSIGNED_TO_DOCTOR unless priority set
- Cannot move to COMPLETED unless treatment started

-----------------------------------------
8️⃣ AUDIT TRAIL
-----------------------------------------

Every state change must:
- Push entry into stateHistory
- Log into audit_logs collection (separate schema)

Audit log fields:
- entityType
- entityId
- action
- performedBy
- timestamp

-----------------------------------------
9️⃣ CLEAN ARCHITECTURE
-----------------------------------------

Follow this structure:

backend/
│
├── src/
│   ├── models/
│   ├── services/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── types/
│   └── utils/

Keep logic clean.
Use TypeScript types properly.
Use proper HTTP status codes.
Handle errors centrally.

-----------------------------------------
10️⃣ BONUS (Optional but preferred)
-----------------------------------------

- Add transition guard helper
- Add ability to fetch full state timeline
- Add filter: “All HIGH priority intakes in TRIAGE_PENDING”
- Add optimistic concurrency control

-----------------------------------------

Deliver:
- Full working implementation
- Clean separation of concerns
- Enterprise-level validation
- No pseudo-code
- Ready-to-run structure

## Why State Machine?
- Prevent invalid workflow
- Ensure compliance
- Track transitions
- Enable audit history

## Iterations
- Added strict transition guard
- Added validation rules
- Added audit log integration