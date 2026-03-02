export enum UserRole {
  Admin = 'Admin',
  Receptionist = 'Receptionist',
  Nurse = 'Nurse',
  Doctor = 'Doctor',
  Specialist = 'Specialist',
  LabTechnician = 'LabTechnician',
  BillingOfficer = 'BillingOfficer',
  ComplianceOfficer = 'ComplianceOfficer',
  Patient = 'Patient',
}

// Role Hierarchy (Optional Enrichment)
export const RoleHierarchy: Record<UserRole, number> = {
  [UserRole.Admin]: 100,
  [UserRole.ComplianceOfficer]: 90,
  [UserRole.Doctor]: 80,
  [UserRole.Specialist]: 80,
  [UserRole.Nurse]: 70,
  [UserRole.LabTechnician]: 60,
  [UserRole.BillingOfficer]: 50,
  [UserRole.Receptionist]: 40,
  [UserRole.Patient]: 10,
};
