# Audit Log Module

## Prompt Used

I need an enterprise-grade Audit Log Module 
for healthcare compliance.

Stack:
Node.js + Express + TypeScript + MongoDB.

---------------------------------------
1️⃣ PURPOSE
---------------------------------------

Track ALL important actions:
- State transitions
- Treatment modifications
- Lab updates
- Appointment creation
- User login
- Role changes

---------------------------------------
2️⃣ AUDIT MODEL
---------------------------------------

Fields:
- entityType
- entityId
- action
- previousValue
- newValue
- performedBy
- ipAddress
- timestamp

---------------------------------------
3️⃣ REQUIREMENTS
---------------------------------------

- Create reusable AuditService
- Every module must call AuditService
- Audit entries must be immutable
- Only ComplianceOfficer can view logs
- Logs cannot be edited or deleted

---------------------------------------
4️⃣ FEATURES
---------------------------------------

- Filter by:
    entityType
    date range
    user
- Export as CSV (basic implementation)

---------------------------------------

- Add soft anonymization
- Add retention policy simulation
- Add audit timeline per entity

Deliver production-level implementation.
No pseudo-code.
Clean architecture.