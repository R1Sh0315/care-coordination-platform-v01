# Care Coordination Platform - Frontend

This is the React-based frontend for the Care Coordination & Clinical Workflow Platform.

## 🚀 Tech Stack
- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **Zustand** (State Management)
- **Axios** (API Client with Interceptors)
- **React Router 6** (Data APIs)
- **Lucide React** (Icons)
- **React Hook Form** (Form Management)

## 📁 Architecture
The project follows a **Feature-based Modular Structure**:
- `src/api`: Centralized Axios instance with auth interceptors.
- `src/components`: Global reusable UI components and Layout.
- `src/features`: Business modules (Auth, Intake, Triage, etc.).
- `src/store`: Managed state using Zustand (Auth, User settings).
- `src/hooks`: Custom React hooks.

## 🔐 Auth & RBAC
- **ProtectedRoute**: A higher-order component that checks authentication and role permissions.
- **Interceptors**: Automatically adds `Bearer` tokens to requests and handles `401 Unauthorized` by redirecting to login.
- **Persistence**: Auth state is synced with `localStorage` for session persistence.

## 🛠️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Ensure the backend is running at `http://localhost:5002`. You can customize the API URL in `.env`.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🏥 Module Progress
- [x] **Auth & Login**: Full implementation with role-based routing.
- [x] **Dashboard Layout**: Premium sidebar and header implementation.
- [x] **Patient Intake**: Full workflow from registration to clinical evaluation.
- [x] **Audit Logs**: Compliance monitoring interface.
- [ ] **Triage Queue**: (Pattern established in Intake).
- [ ] **Appointments**: (Ready for API integration).
- [ ] **Treatment Plans**: (Ready for version-controlled UI).
- [ ] **Lab Workflow**: (Ready for state-switching UI).
