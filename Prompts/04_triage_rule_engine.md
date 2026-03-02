# Triage Rule Engine

## Prompt Used
I am building a Care Coordination & Clinical Workflow Platform backend 
using Node.js, Express, TypeScript, MongoDB.

I need a configurable Triage Rule Engine.

---------------------------------------
1️⃣ GOAL
---------------------------------------

Automatically determine:
- priority (LOW | MEDIUM | HIGH)
- optional doctor assignment
- escalation flag

based on symptoms, age, and vitals.

---------------------------------------
2️⃣ SAMPLE RULES
---------------------------------------

Example rules:

1) IF symptoms includes "Chest Pain"
   THEN priority = HIGH
   AND assignDoctorType = "Emergency"

2) IF age > 65 AND bloodPressure.systolic > 150
   THEN priority = HIGH

3) IF temperature > 102
   THEN priority = MEDIUM

---------------------------------------
3️⃣ REQUIREMENTS
---------------------------------------

- Store rules in MongoDB collection
- Rules must be configurable (JSON format)
- Create Rule schema:
    - name
    - conditions
    - actions
    - isActive
    - createdAt

- Implement RuleEngineService:
    - evaluateIntake(intake)
    - applyMatchingRules()
    - resolvePriorityConflicts()

---------------------------------------
4️⃣ PRIORITY RESOLUTION
---------------------------------------

If multiple rules match:
HIGH > MEDIUM > LOW

---------------------------------------
5️⃣ INTEGRATION
---------------------------------------

Trigger rule engine automatically when intake moves to TRIAGE_PENDING.

---------------------------------------
6️⃣ BONUS
---------------------------------------

- Add rule priority weight
- Add rule evaluation logs
- Add ability to simulate rules

Deliver full working implementation.
No pseudo-code.
Enterprise-ready structure.

## Why Rule Engine?
- Enables configurable medical triage logic
- Avoids hardcoded business rules
- Allows dynamic priority assignment
- Supports emergency auto-escalation
- Makes system extensible for future rule updates

## Architecture Decisions
- Rules stored in MongoDB as JSON
- RuleEngineService evaluates intake dynamically
- Priority conflict resolution: HIGH > MEDIUM > LOW
- Triggered automatically on TRIAGE_PENDING state
- Decoupled from controller layer

## Iterations
- Added rule priority weighting
- Added rule activation flag (isActive)
- Added rule evaluation logging
- Added simulation mode for testing rules
- Added integration with Intake State Machine