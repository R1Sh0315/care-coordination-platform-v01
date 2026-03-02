# Authentication & RBAC Prompt

## Prompt Used
I am building a Care Coordination & Clinical Workflow Platform backend 
using:

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT authentication

Please generate a production-grade Authentication and Role-Based Access Control (RBAC) module with the following requirements:

-------------------------------------
1️⃣ USER ROLES
-------------------------------------

The system supports these roles:

- Admin
- Receptionist
- Nurse
- Doctor
- Specialist
- LabTechnician
- BillingOfficer
- ComplianceOfficer
- Patient

Roles must be strongly typed using a TypeScript enum.

-------------------------------------
2️⃣ USER MODEL
-------------------------------------

Create a Mongoose User schema with:

- name
- email (unique)
- password (hashed using bcrypt)
- role (enum)
- isActive (boolean)
- createdAt
- updatedAt

Password must:
- Be hashed before saving
- Never be returned in API response

-------------------------------------
3️⃣ AUTH FEATURES
-------------------------------------

Implement:

- Register user (Admin only)
- Login (email + password)
- Generate JWT token
- JWT expiration (e.g. 1 hour)
- Token payload should include:
  - userId
  - role

-------------------------------------
4️⃣ MIDDLEWARE
-------------------------------------

Create middleware:

A) authenticateJWT
- Verify token
- Attach user to request object
- Reject if invalid/expired

B) authorizeRoles(...roles)
- Accept allowed roles
- Reject if user's role not permitted

-------------------------------------
5️⃣ ROLE-BASED EXAMPLES
-------------------------------------

Create example protected routes:

- GET /admin/users → Admin only
- POST /patients → Receptionist or Admin
- POST /triage → Nurse only
- POST /treatment-plan → Doctor only
- GET /audit-logs → ComplianceOfficer only

-------------------------------------
6️⃣ PROJECT STRUCTURE
-------------------------------------

Follow clean folder structure:

backend/
│
├── src/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── types/
│   └── app.ts
│
└── server.ts

-------------------------------------
7️⃣ SECURITY REQUIREMENTS
-------------------------------------

- Use bcrypt with salt rounds
- Do not expose password in JSON
- Use environment variables for JWT secret
- Use centralized error handling
- Use proper HTTP status codes

-------------------------------------
8️⃣ BONUS (Optional but preferred)
-------------------------------------

- Add refresh token support
- Add role hierarchy support
- Add account deactivation check
- Add basic rate limiting

-------------------------------------

Deliver:

- All required files
- Clean TypeScript types
- Proper separation of concerns
- Example route usage
- Minimal comments but clean code
- Ready-to-run code

Do not skip implementation details.
Make it enterprise-ready.

## Architecture Decision Notes
- Used JWT for stateless auth
- Used middleware for route-level RBAC
- Enum-based roles for type safety
- Separation of controllers & services

## Improvements Iteration
<if you refined it>