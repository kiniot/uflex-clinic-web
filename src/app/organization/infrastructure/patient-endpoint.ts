import {environment} from '../../../environments/environment';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {PatientAssembler} from './patient-assembler';
import {PatientRequest, PatientResponse, AssignPatientRequest} from './patient-request';
import {PatientResource} from './patient-response';
import {Patient} from '../domain/model/patient.entity';
import {UnassignedPatient} from '../domain/model/unassigned-patient.entity';

const patientApiEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderPatientsEndpointPath}`;
const patientsMyEndpointPath = '/v1/patients/my';
const patientsByPhysiotherapistEndpointPath = '/v1/patients/by-physiotherapist';

export class PatientApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient, private assembler: PatientAssembler) {
    super();
  }

  getAll(): Observable<Patient[]> {
    return this.http.get<PatientResponse[]>(patientApiEndpointUrl).pipe(
      map(response => response.map(r => this.assembler.toEntityFromResource(r as unknown as PatientResource))),
      catchError(this.handleError('Failed to fetch patients'))
    );
  }

  getMyPatients(): Observable<Patient[]> {
    const url = `${environment.platformProviderApiBaseUrl}${patientsMyEndpointPath}`;
    return this.http.get<PatientResponse[]>(url).pipe(
      map(response => response.map(r => this.assembler.toEntityFromResource(r as unknown as PatientResource))),
      catchError(this.handleError('Failed to fetch my patients'))
    );
  }

  getUnassignedPatients(): Observable<UnassignedPatient[]> {
    return this.getAll().pipe(
      map(patients => patients
        .filter(p => p.status === 'UNASSIGNED')
        .map(p => this.assembler.toUnassignedPatientFromResource({
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
          dni: p.dni,
          birthDate: p.birthDate,
          gender: p.gender,
          email: p.email,
          countryCode: p.countryCode,
          phoneNumber: p.phoneNumber,
          medicalCondition: p.medicalCondition,
          assignedPhysiotherapistId: p.assignedPhysiotherapistId,
          treatmentPlanId: p.treatmentPlanId,
          status: p.status,
          clinicId: p.clinicId
        }))
      )
    );
  }

  getById(id: string): Observable<Patient> {
    return this.http.get<PatientResponse>(`${patientApiEndpointUrl}/${id}`).pipe(
      map(response => this.assembler.toEntityFromResource(response as unknown as PatientResource)),
      catchError(this.handleError('Failed to fetch patient'))
    );
  }

  create(command: {
    firstName: string;
    lastName: string;
    dni: string;
    birthDate: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    email: string;
    countryCode: string;
    phoneNumber: string;
    medicalCondition?: string;
    assignedPhysiotherapistId?: string;
  }): Observable<Patient> {
    const request: PatientRequest = this.assembler.toRequestFromCommand(
      command.firstName,
      command.lastName,
      command.dni,
      command.birthDate,
      command.gender,
      command.email,
      command.countryCode,
      command.phoneNumber,
      command.medicalCondition,
      command.assignedPhysiotherapistId
    );
    return this.http.post<PatientResponse>(patientApiEndpointUrl, request).pipe(
      map(response => this.assembler.toEntityFromResource(response as unknown as PatientResource)),
      catchError(this.handleError('Failed to create patient'))
    );
  }

  createByPhysiotherapist(command: {
    firstName: string;
    lastName: string;
    dni: string;
    birthDate: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    email: string;
    countryCode: string;
    phoneNumber: string;
    medicalCondition?: string;
  }): Observable<Patient> {
    const request: PatientRequest = this.assembler.toRequestFromCommand(
      command.firstName,
      command.lastName,
      command.dni,
      command.birthDate,
      command.gender,
      command.email,
      command.countryCode,
      command.phoneNumber,
      command.medicalCondition
    );
    const url = `${environment.platformProviderApiBaseUrl}${patientsByPhysiotherapistEndpointPath}`;
    return this.http.post<PatientResponse>(url, request).pipe(
      map(response => this.assembler.toEntityFromResource(response as unknown as PatientResource)),
      catchError(this.handleError('Failed to create patient'))
    );
  }

  assign(patientId: string, physiotherapistId: string): Observable<void> {
    const request = this.assembler.toAssignRequest(physiotherapistId);
    return this.http.put<void>(`${patientApiEndpointUrl}/${patientId}/assign`, request).pipe(
      catchError(this.handleError('Failed to assign patient'))
    );
  }

  discharge(patientId: string): Observable<void> {
    return this.http.put<void>(`${patientApiEndpointUrl}/${patientId}/discharge`, {}).pipe(
      catchError(this.handleError('Failed to discharge patient'))
    );
  }
}