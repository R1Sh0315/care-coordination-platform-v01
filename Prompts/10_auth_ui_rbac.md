# Authentication UI & RBAC (Frontend)

## Prompt Used

I need to implement Authentication UI for my healthcare platform frontend.

Requirements:

1. Login page (email + password)
2. Store JWT securely
3. Global auth store
4. Auto logout on token expiry
5. Protected routes based on roles
6. Hide sidebar menu items based on role
7. Redirect unauthorized users

Roles:
- Admin
- Receptionist
- Nurse
- Doctor
- LabTechnician
- ComplianceOfficer

Implement:

- Login page
- useAuth hook
- ProtectedRoute component
- Role-based navigation rendering

Ensure:
- Clean UX
- Loading states
- Error handling
- Secure token storage strategy

Deliver complete implementation.

---

## Why RBAC in Frontend?

- Prevent UI-level access
- Improve UX clarity
- Hide irrelevant modules
- Match backend enforcement

---

## Architecture Decisions

- Stored token in memory + localStorage
- Created useAuth hook
- Sidebar filtered by role
- ProtectedRoute wrapper used in router config

---

## Iterations

- Added auto logout timer
- Added 401 interceptor redirect
- Improved loading state handling
- Refactored role-check utility