# Frontend Architecture Design

## Prompt Used

I am building the frontend for a Care Coordination & Clinical Workflow Platform.

Stack:
- React
- TypeScript
- Vite
- React Router
- Zustand (or Redux Toolkit)
- Axios

Please generate:

1. Clean scalable folder structure
2. Role-based route protection
3. Layout with sidebar navigation
4. API service layer abstraction
5. Centralized error handling
6. Auth context or store
7. ProtectedRoute component
8. Clean modular architecture

Ensure:
- Separation of features
- Feature-based folder structure
- Reusable UI components
- Enterprise-ready structure
- No overengineering

Deliver ready-to-use structure and example boilerplate.

---

## Why This Architecture?

- Feature-based modular structure
- Clean separation of concerns
- Scalable routing
- Centralized API abstraction
- Easy integration with RBAC

---

## Architecture Decisions

- Used feature-based folder structure
- Centralized Axios instance
- ProtectedRoute wrapper for RBAC
- Layout component for consistent UI
- Global auth state using Zustand
- Error boundary for UI fallback

---

## Iterations

- Added lazy loading for routes
- Added role-based navigation filtering
- Improved token persistence strategy
- Added global toast notification system