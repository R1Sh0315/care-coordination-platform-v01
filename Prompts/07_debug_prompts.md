# Debugging & Refinement Prompts

This document captures how AI was used to:
- Debug issues
- Improve architecture
- Refactor logic
- Identify edge cases
- Strengthen validation & security

It reflects iterative AI-assisted development rather than one-time code generation.

---

## 1️⃣ Intake State Transition Bug

### Problem
Invalid transitions were not properly blocked when attempting to skip states 
(e.g., DRAFT → TRIAGED directly).

### Prompt Used

I am implementing a state machine for patient intake.

Current issue:
The system allows skipping intermediate states when updating currentState directly.

Please refactor my transition logic to:
- Strictly enforce allowed transitions
- Reject invalid transitions
- Centralize transition validation
- Prevent direct state mutation
- Return proper HTTP 400 error for invalid transitions

Ensure enterprise-grade implementation.

### AI Suggestion Summary
- Introduced `validateTransition()` function
- Added transition map object
- Prevented direct model state update
- Enforced guard before save()

### Fix Applied
- Refactored transition logic into service layer
- Removed state update from controller
- Added unit-level validation check

---

## 2️⃣ Appointment Overlap Detection Issue

### Problem
Doctor double booking was possible during near-simultaneous requests.

### Prompt Used

I am facing a race condition in appointment booking.

Two requests can book the same doctor at overlapping times.

Please suggest:
- Proper overlap detection query
- MongoDB index strategy
- Optimistic concurrency approach
- How to prevent race condition in Node.js + MongoDB

Provide production-safe solution.

### AI Suggestion Summary
- Implemented time-range overlap query:
  existingStart < newEnd AND existingEnd > newStart
- Added compound index on doctorId + appointmentDate
- Suggested transaction/session support
- Recommended atomic availability check

### Fix Applied
- Added overlap validation before save
- Implemented Mongoose transaction
- Added index optimization

---

## 3️⃣ JWT Authentication Failure

### Problem
Expired JWT tokens were not returning correct error message.

### Prompt Used

In my Express middleware, expired JWT tokens return generic 500 error.

Please:
- Improve error handling
- Differentiate expired vs invalid token
- Return proper 401 response
- Suggest centralized error handler implementation

### AI Suggestion Summary
- Used jsonwebtoken error types
- Added custom error class
- Implemented centralized error middleware
- Returned structured JSON error

### Fix Applied
- Refactored authentication middleware
- Added error classification
- Improved error responses

---

## 4️⃣ Audit Log Missing Previous Values

### Problem
Audit logs were not correctly capturing previousValue for updates.

### Prompt Used

My audit log service does not reliably capture previousValue before update.

Please suggest:
- Safe way to capture previous state
- Where to hook audit logging
- How to avoid partial logging
- Ensure atomicity of update + audit entry

### AI Suggestion Summary
- Fetch entity before update
- Store deep clone as previousValue
- Log within transaction
- Ensure audit write failure does not break main operation

### Fix Applied
- Added pre-update fetch
- Added structured snapshot capture
- Integrated logging inside service layer

---

## 5️⃣ Role-Based Access Bypass

### Problem
Certain routes were accessible if middleware was forgotten.

### Prompt Used

I want to enforce global RBAC protection.

How can I:
- Prevent missing middleware errors
- Ensure every route is protected
- Automatically validate role mapping
- Add safeguard during app startup

### AI Suggestion Summary
- Introduced route-level wrapper
- Created protectedRoute() helper
- Suggested lint rule strategy
- Added default deny policy

### Fix Applied
- Refactored route registration
- Added RBAC wrapper utility
- Verified all routes protected

---

## 6️⃣ Performance Optimization

### Problem
Intake listing API was slow when filtering high-priority cases.

### Prompt Used

My MongoDB query for filtering high-priority TRIAGE_PENDING intakes is slow.

Please suggest:
- Proper indexing strategy
- Query optimization
- Projection improvements
- Pagination best practices

### AI Suggestion Summary
- Added compound index: priority + currentState
- Suggested lean() queries
- Implemented cursor-based pagination
- Reduced unnecessary population

### Fix Applied
- Added indexes
- Used .lean()
- Implemented pagination

---

# Lessons Learned From Debug Prompts

- State machines must centralize transition logic
- Concurrency must be handled carefully in scheduling
- Middleware errors should never default to 500
- Audit logging must be atomic
- RBAC must follow default-deny principle
- Indexing is critical for workflow-heavy systems

---

# Iterative Development Approach

1. Generated baseline module
2. Tested manually
3. Identified flaws
4. Used targeted debugging prompts
5. Refactored
6. Re-tested
7. Improved performance and security

This demonstrates applied AI collaboration rather than passive code generation.