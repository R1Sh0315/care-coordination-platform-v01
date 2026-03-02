import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import IntakeList from './features/intake/IntakeList';
import CreateIntake from './features/intake/CreateIntake';
import IntakeDetail from './features/intake/IntakeDetail';
import { UserRole } from './store/authStore';

import AuditLogs from './features/audit/AuditLogs';

// Simple placeholder components for other modules
const Dashboard = () => <div><h1>Dashboard</h1><p>Welcome to the Clinical Platform Overview.</p></div>;
const TriageList = () => <div><h1>Triage Queue</h1><p>Patient clinical evaluation area.</p></div>;
const Appointments = () => <div><h1>Appointments</h1><p>Scheduling and calendar management.</p></div>;
const Treatments = () => <div><h1>Treatment Plans</h1><p>Clinical care plans and medication tracking.</p></div>;
const Labs = () => <div><h1>Lab Workflow</h1><p>Laboratory orders and result processing.</p></div>;
const Unauthorized = () => <div style={{ textAlign: 'center', marginTop: '100px' }}><h1>403 - Unauthorized</h1><p>You do not have permission to access this module.</p></div>;

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'intake',
        element: <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Receptionist, UserRole.Nurse]}><IntakeList /></ProtectedRoute>,
      },
      {
        path: 'intake/new',
        element: <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Receptionist]}><CreateIntake /></ProtectedRoute>,
      },
      {
        path: 'intake/:id',
        element: <IntakeDetail />,
      },
      {
        path: 'triage',
        element: <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Nurse, UserRole.Doctor]}><TriageList /></ProtectedRoute>,
      },
      {
        path: 'appointments',
        element: <Appointments />,
      },
      {
        path: 'treatments',
        element: <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Doctor, UserRole.Nurse]}><Treatments /></ProtectedRoute>,
      },
      {
        path: 'labs',
        element: <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.Doctor, UserRole.LabTechnician]}><Labs /></ProtectedRoute>,
      },
      {
        path: 'audit',
        element: <ProtectedRoute allowedRoles={[UserRole.Admin, UserRole.ComplianceOfficer]}><AuditLogs /></ProtectedRoute>,
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
