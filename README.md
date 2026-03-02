# Care Coordination & Clinical Workflow Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933.svg)](https://nodejs.org/)

An enterprise-grade, HIPAA-compliant patient care coordination system designed to streamline clinical workflows, automate triage scoring, and manage the end-to-end patient treatment lifecycle.

---

## 🚀 Overview

The **Care Coordination & Clinical Workflow Platform** is a specialized MERN-based solution for healthcare providers. It transitions from traditional manual intake processes to an intelligent, state-driven workflow management system.

### Key Capabilities:
- **Intake Lifecycle Management**: A robust finite state machine (FSM) governing patient onboarding.
- **Clinical Triage Engine**: Rule-based logic to prioritize patients based on clinical risk factors.
- **Treatment Plans**: Lifecycle tracking for chronic and acute care management.
- **Lab Integration**: Digital workflow for lab requests, tracking, and results reconciliation.
- **Enterprise Security**: Advanced RBAC with granular permissions and comprehensive audit logging.

---

## 🏗️ Architecture Overview

The platform follows a **Clean Architecture** pattern to ensure scalability and maintainability.

- **Frontend**: A modular React application using functional components, TypeScript for type safety, and a centralized state management approach.
- **Backend**: A RESTful API built with Express.js and TypeScript, utilizing a Controller-Service-Repository pattern.
- **Database**: MongoDB for flexible, document-based storage of complex clinical data.
- **State Machine**: Custom implementation for tracking `Patient Intake` and `Treatment Plan` states.

---

## 📁 Project Structure

```text
care-coordination-platform/
├── backend/                # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic & Rule engine
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth & RBAC guards
│   │   ├── utils/          # State machine & Clinical helpers
│   │   └── index.ts        # Entry point
│   ├── tests/              # Unit & Integration tests
│   └── .env.example        # Backend environment variables
├── frontend/               # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/     # UI Library (Atomic Design)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # View logic
│   │   ├── store/          # State management
│   │   └── api/            # Generic API client
│   └── .env.example        # Frontend environment variables
├── Prompts/                # High-level architecture & design documentation
└── README.md
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secrets
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Update .env with YOUR API base URL
npm run dev
```

---

## 🔐 Role-Based Access Control (RBAC)

The system defines four primary roles with distinct permission sets:

| Role | Access Level | Description |
| :--- | :--- | :--- |
| **Administrator** | Super User | Full access to system logs, user management, and reporting. |
| **Clinician** | Write | Can triage patients, create treatment plans, and order labs. |
| **Nurse/Staff** | Read/Update | Manages intake schedules and patient communication. |
| **Patient** | Restricted | Access to personal health records and appointment history. |

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/care_platform
JWT_SECRET=your_super_secret_jwt_key
ENVIRONMENT=development
```

### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 📈 Future Enhancements
- [ ] **HL7/FHIR Integration**: Standardized healthcare data exchange.
- [ ] **AI Prioritization**: Machine learning models for advanced risk prediction.
- [ ] **Mobile Application**: Native iOS/Android app for clinician mobility.
- [ ] **Telehealth**: Integrated video conferencing for remote consultations.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Developed for enterprise-scale clinical coordination.**
