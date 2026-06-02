import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { AssignPatientCommand } from '../domain/model/assign-patient.command';
import { CreateClinicCommand } from '../domain/model/create-clinic.command';
import { RegisterPatientCommand } from '../domain/model/register-patient.command';
import { RegisterPhysiotherapistCommand } from '../domain/model/register-physiotherapist.command';
import { AssignPatientApiEndpoint } from './assign-patient-endpoint';
import { ClinicAdminProfileAssembler } from './clinic-admin-profile-assembler';
import { ClinicAdminProfileResource } from './clinic-admin-profile-response';
import { ClinicProfileAssembler } from './clinic-profile-assembler';
import { ClinicProfileResource } from './clinic-profile-response';
import { CreateClinicAssembler } from './create-clinic-assembler';
import { CreateClinicApiEndpoint } from './create-clinic-endpoint';
import { ClinicResource } from './create-clinic-response';
import { CurrentClinicAdminApiEndpoint } from './current-clinic-admin-endpoint';
import { CurrentClinicApiEndpoint } from './current-clinic-endpoint';
import { CurrentPhysiotherapistApiEndpoint } from './current-physiotherapist-endpoint';
import { DischargePatientApiEndpoint } from './discharge-patient-endpoint';
import { MyPatientsApiEndpoint } from './my-patients-endpoint';
import { PatientAssembler } from './patient-assembler';
import { PatientByIdApiEndpoint } from './patient-by-id-endpoint';
import { PatientResource } from './patient.response';
import { PatientsApiEndpoint } from './patients-endpoint';
import { PatientsByClinicApiEndpoint } from './patients-by-clinic-endpoint';
import { PatientsByPhysiotherapistApiEndpoint } from './patients-by-physiotherapist-endpoint';
import { PhysiotherapistByIdApiEndpoint } from './physiotherapist-by-id-endpoint';
import { PhysiotherapistProfileAssembler } from './physiotherapist-profile-assembler';
import { PhysiotherapistProfileResource } from './physiotherapist-profile-response';
import { PhysiotherapistsApiEndpoint } from './physiotherapists-endpoint';
import { RegisterPatientApiEndpoint } from './register-patient-endpoint';
import { RegisterPatientByClinicAdminApiEndpoint } from './register-patient-by-clinic-admin-endpoint';
import { RegisterPhysiotherapistApiEndpoint } from './register-physiotherapist-endpoint';

/**
 * API service for Organization bounded-context operations.
 * Admin and physiotherapist flows are separated by method names, even when
 * they share the same underlying resources.
 */
@Injectable({ providedIn: 'root' })
export class OrganizationApi extends BaseApi {
  private readonly createClinicEndpoint: CreateClinicApiEndpoint;
  private readonly currentClinicEndpoint: CurrentClinicApiEndpoint;
  private readonly currentClinicAdminEndpoint: CurrentClinicAdminApiEndpoint;
  private readonly currentPhysiotherapistEndpoint: CurrentPhysiotherapistApiEndpoint;
  private readonly physiotherapistsEndpoint: PhysiotherapistsApiEndpoint;
  private readonly physiotherapistByIdEndpoint: PhysiotherapistByIdApiEndpoint;
  private readonly registerPhysiotherapistEndpoint: RegisterPhysiotherapistApiEndpoint;
  private readonly patientsEndpoint: PatientsApiEndpoint;
  private readonly patientsByClinicEndpoint: PatientsByClinicApiEndpoint;
  private readonly patientsByPhysiotherapistEndpoint: PatientsByPhysiotherapistApiEndpoint;
  private readonly myPatientsEndpoint: MyPatientsApiEndpoint;
  private readonly patientByIdEndpoint: PatientByIdApiEndpoint;
  private readonly registerPatientByClinicAdminEndpoint: RegisterPatientByClinicAdminApiEndpoint;
  private readonly registerPatientByPhysiotherapistEndpoint: RegisterPatientApiEndpoint;
  private readonly assignPatientEndpoint: AssignPatientApiEndpoint;
  private readonly dischargePatientEndpoint: DischargePatientApiEndpoint;

  constructor(http: HttpClient) {
    super();
    const createClinicAssembler = new CreateClinicAssembler();
    const clinicProfileAssembler = new ClinicProfileAssembler();
    const clinicAdminProfileAssembler = new ClinicAdminProfileAssembler();
    const patientAssembler = new PatientAssembler();
    const physiotherapistAssembler = new PhysiotherapistProfileAssembler();

    this.createClinicEndpoint = new CreateClinicApiEndpoint(http, createClinicAssembler);
    this.currentClinicEndpoint = new CurrentClinicApiEndpoint(http, clinicProfileAssembler);
    this.currentClinicAdminEndpoint = new CurrentClinicAdminApiEndpoint(
      http,
      clinicAdminProfileAssembler,
    );
    this.currentPhysiotherapistEndpoint = new CurrentPhysiotherapistApiEndpoint(
      http,
      physiotherapistAssembler,
    );
    this.physiotherapistsEndpoint = new PhysiotherapistsApiEndpoint(http, physiotherapistAssembler);
    this.physiotherapistByIdEndpoint = new PhysiotherapistByIdApiEndpoint(
      http,
      physiotherapistAssembler,
    );
    this.registerPhysiotherapistEndpoint = new RegisterPhysiotherapistApiEndpoint(
      http,
      physiotherapistAssembler,
    );
    this.patientsEndpoint = new PatientsApiEndpoint(http, patientAssembler);
    this.patientsByClinicEndpoint = new PatientsByClinicApiEndpoint(http, patientAssembler);
    this.patientsByPhysiotherapistEndpoint = new PatientsByPhysiotherapistApiEndpoint(
      http,
      patientAssembler,
    );
    this.myPatientsEndpoint = new MyPatientsApiEndpoint(http, patientAssembler);
    this.patientByIdEndpoint = new PatientByIdApiEndpoint(http, patientAssembler);
    this.registerPatientByClinicAdminEndpoint = new RegisterPatientByClinicAdminApiEndpoint(
      http,
      patientAssembler,
    );
    this.registerPatientByPhysiotherapistEndpoint = new RegisterPatientApiEndpoint(
      http,
      patientAssembler,
    );
    this.assignPatientEndpoint = new AssignPatientApiEndpoint(http, patientAssembler);
    this.dischargePatientEndpoint = new DischargePatientApiEndpoint(http);
  }

  createClinic(command: CreateClinicCommand): Observable<ClinicResource> {
    return this.createClinicEndpoint.createClinic(command);
  }

  getCurrentClinic(): Observable<ClinicProfileResource> {
    return this.currentClinicEndpoint.getCurrentClinic();
  }

  getCurrentClinicAdmin(): Observable<ClinicAdminProfileResource> {
    return this.currentClinicAdminEndpoint.getCurrentClinicAdmin();
  }

  getClinicPhysiotherapists(): Observable<PhysiotherapistProfileResource[]> {
    return this.physiotherapistsEndpoint.getPhysiotherapists();
  }

  getClinicPhysiotherapistById(id: string): Observable<PhysiotherapistProfileResource> {
    return this.physiotherapistByIdEndpoint.getPhysiotherapistById(id);
  }

  registerPhysiotherapistAsClinicAdmin(
    command: RegisterPhysiotherapistCommand,
  ): Observable<PhysiotherapistProfileResource> {
    return this.registerPhysiotherapistEndpoint.registerPhysiotherapist(command);
  }

  getClinicPatients(): Observable<PatientResource[]> {
    return this.patientsEndpoint.getPatients();
  }

  getClinicPatientsByClinicId(clinicId: string): Observable<PatientResource[]> {
    return this.patientsByClinicEndpoint.getPatientsByClinicId(clinicId);
  }

  getPatientsByPhysiotherapistId(physiotherapistId: string): Observable<PatientResource[]> {
    return this.patientsByPhysiotherapistEndpoint.getPatientsByPhysiotherapistId(physiotherapistId);
  }

  registerPatientAsClinicAdmin(command: RegisterPatientCommand): Observable<PatientResource> {
    return this.registerPatientByClinicAdminEndpoint.registerPatient(command);
  }

  assignPatient(patientId: string, command: AssignPatientCommand): Observable<void> {
    return this.assignPatientEndpoint.assignPatient(patientId, command);
  }

  getCurrentPhysiotherapist(): Observable<PhysiotherapistProfileResource> {
    return this.currentPhysiotherapistEndpoint.getCurrentPhysiotherapist();
  }

  getMyPatients(): Observable<PatientResource[]> {
    return this.myPatientsEndpoint.getMyPatients();
  }

  getPatientById(id: string): Observable<PatientResource> {
    return this.patientByIdEndpoint.getPatientById(id);
  }

  registerPatientAsPhysiotherapist(command: RegisterPatientCommand): Observable<PatientResource> {
    return this.registerPatientByPhysiotherapistEndpoint.registerPatient(command);
  }

  dischargePatient(id: string): Observable<void> {
    return this.dischargePatientEndpoint.dischargePatient(id);
  }
}
