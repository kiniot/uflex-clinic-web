export interface UpdatePatientByClinicAdminRequest {
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  medicalCondition: string;
  assignedPhysiotherapistId: string | null;
}
