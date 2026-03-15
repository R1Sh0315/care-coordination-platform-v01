# Prompt: Build Clinical Lab Management System

Create a **Clinical Lab Management System** for the `/labs` route that functions as a full **clinical laboratory workflow interface**.

The system should support **real-time order tracking, structured lab result workflows, and role-based access control** for administrators, doctors, and lab technicians.

---

# 1. Real-Time Data & Clock

The lab dashboard must support **real-time synchronization** similar to an admin dashboard.

Requirements:

- Display a **live ticking clock**
- Automatically **refresh lab data every 60 seconds**
- Ensure clinicians and lab staff always see the **latest lab order status**

This should allow continuous monitoring of lab workflows.

---

# 2. Lab Order Status Badges

Each lab order should display **visual status badges**.

Supported statuses:

- PENDING
- PROCESSING
- COMPLETED
- REVIEWED

Example:

PENDING  
PROCESSING  
COMPLETED

Color mapping:

- PENDING → Grey
- PROCESSING → Orange
- COMPLETED → Blue
- REVIEWED → Green

These badges should allow users to quickly identify the stage of a lab order.

---

# 3. Clinical UI Layout

Lab orders should be displayed using **clinical cards or a structured table view**.

Each record should clearly show:

- Patient information
- Ordering doctor
- Assigned lab technician
- Order timestamp
- Requested tests
- Current status

---

## Patient Context

Each lab order must display:

- Patient name
- Ordering doctor
- Assigned lab technician
- Order creation timestamp

Example:

Patient: Sophia Chen  
Ordered by: Dr. Adams

This helps maintain full traceability of lab requests.

---

## Test Information

Each order should show the **requested lab tests** as visual tags.

Example:

- Blood Test
- Complete Blood Count
- Glucose Test
- Lipid Profile

These tags help doctors and technicians quickly understand the requested tests.

---

## Lab Result Workflow

The lab system must support the following workflow:

1. Doctor creates lab order
2. Lab technician starts processing
3. Lab technician uploads results
4. Doctor reviews results

---

# 4. Role-Based Workflow Actions

Different users must have different permissions.

### Admin / Lab Technician

Allowed actions:

- Start Processing
- Complete & Upload Results

These actions move the lab order forward in the workflow.

---

### Doctor

Doctors should have the ability to:

- Mark Reviewed

This confirms the doctor has reviewed the lab results.

---

# 5. Backend API Integration

Create a backend endpoint:

GET /clinical/labs

This endpoint should return all lab orders with related data.

---

## Service Layer

Create a service method:

getAllLabOrders

File:

lab.service.ts

Responsibilities:

- Fetch all lab orders
- Populate related entities:
  - Patient
  - Doctor
  - Lab Technician

---

## Controller

Create a controller method:

list

File:

lab.controller.ts

Responsibilities:

- Handle requests to fetch lab orders
- Return populated lab order data

---

## Routes

Register the endpoint in:

clinical.routes.ts

Route:

GET /clinical/labs

Accessible roles:

- Admins
- Doctors
- Lab Technicians

---

# 6. System Behavior

The system should behave as a **complete clinical laboratory workflow system**.

Key capabilities:

- Real-time lab order monitoring
- Role-based access control
- Structured patient and test information
- Lab result upload and review workflow
- Visual status badges

---

# Expected Output

The `/labs` page should display:

- A real-time lab dashboard
- Structured lab order cards or table
- Status tracking badges
- Role-based action buttons
- Full backend integration

The goal is to create a **complete clinical laboratory management tool** for healthcare workflows.