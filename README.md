# Care Coordination & Clinical Workflow Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933.svg)](https://nodejs.org/)

An enterprise-grade, HIPAA-compliant patient care coordination system designed to streamline clinical workflows, automate triage scoring, and manage the end-to-end patient treatment lifecycle.

---

## 🌐 Live Infrastructure
- **Backend API**: [https://care-coordination-platform-v01.onrender.com/](https://care-coordination-platform-v01.onrender.com/)
- **API Documentation**: [https://care-coordination-platform-v01.onrender.com/api-docs](https://care-coordination-platform-v01.onrender.com/api-docs)

---

## 🚀 Overview

The **Care Coordination & Clinical Workflow Platform** is a specialized MERN-based solution for healthcare providers. It transitions from traditional manual intake processes to an intelligent, state-driven workflow management system.

### Key Capabilities:
- **Interactive Admin Intelligence**: Real-time analytical dashboard with live platform metrics, system load monitoring, and audit log tracking.
- **Mutual Appointment Booking**: Smart scheduling system that checks **both** patient and doctor availability to prevent double-bookings. Supports seamless cancellation and rescheduling.
- **Clinical Treatment Pathways**: Advanced lifecycle management for care plans with medication safety monitors (Controlled Substance flagging) and interactive pathway drawers.
- **Intake Lifecycle Management**: A robust finite state machine (FSM) governing patient onboarding and clinical triage.
- **Enterprise Security**: Advanced RBAC (Patient, Doctor, Nurse, Admin) with granular permissions and immutable audit logging.

---

## 🏗️ Architecture Overview

The platform follows a **Clean Architecture** pattern to ensure scalability and maintainability.

- **Frontend**: A modular React application built with TypeScript, featuring a **Premium UI** with dynamic components, modals, and drawers.
- **Backend**: A RESTful API built with Express.js and TypeScript, utilizing a Controller-Service-Repository pattern.
- **Database**: MongoDB for flexible, document-based storage of clinical data.
- **Real-Time Layer**: Polling-based live updates for dashboards and clinical lists.

---

## 📁 Project Structure

```text
care-coordination-platform/
├── backend/                # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/    # Analytical & Workflow handlers
│   │   ├── services/       # Business logic (Availability, Treatments, etc.)
│   │   ├── models/         # Clinical schemas (FHIR-inspired)
│   │   ├── routes/         # API endpoints
│   │   └── middleware/     # Auth & RBAC guards
├── frontend/               # React + Vite + TypeScript
│   ├── src/
│   │   ├── features/       # Feature-based architecture (Dashboards, Appointments, etc.)
│   │   ├── components/     # UI Library (Layout, Sidebar)
│   │   └── store/          # Zustand state management
├── Prompts/                # Comprehensive system documentation
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
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Role-Based Access Control (RBAC)

The system defines specific permissions for enterprise clinical operations:

| Role | Access Level | Description |
| :--- | :--- | :--- |
| **Administrator** | Full Control | System health monitoring, global audit logs, user management. |
| **Doctor** | Clinical Lead | Create treatment plans, manage assigned patients, view clinical pathways. |
| **Nurse** | Clinical Support | Process Triage queue, monitor patient vitals, update intake states. |
| **Receptionist** | Front Desk | Register patient intakes, manage appointment scheduling. |
| **Patient** | Self-Service | Book/Reschedule personal appointments, view personal treatment plans. |

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
```env
PORT=5002
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRATION=1h
REFRESH_TOKEN_SECRET=your_long_random_refresh_secret
REFRESH_TOKEN_EXPIRATION=7d
NODE_ENV=development
BCRYPT_SALT_ROUNDS=10
INITIAL_ADMIN_EMAIL=your_admin_email@example.com
INITIAL_ADMIN_PASSWORD=your_secure_password
INITIAL_ADMIN_NAME=System Administrator
```

### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5002/api/v1
```

---

## 📈 Future Enhancements
- [ ] **Lab Order Processing**: Digital result entry and technician workflow.
- [ ] **HL7/FHIR Integration**: Standardized healthcare data exchange.
- [ ] **AI-Driven Triage**: Machine learning models for advanced risk prediction.
- [ ] **Telehealth**: Integrated video conferencing for remote consultations.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Developed for enterprise-scale clinical coordination.**
