import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ClinicProfileAssembler } from './clinic-profile-assembler';
import { ClinicProfileResource } from './clinic-profile-response';
import { CreateClinicCommand } from '../domain/model/create-clinic.command';
import { CurrentClinicApiEndpoint } from './current-clinic-endpoint';
import { CurrentPhysiotherapistApiEndpoint } from './current-physiotherapist-endpoint';
import { CreateClinicAssembler } from './create-clinic-assembler';
import { CreateClinicApiEndpoint } from './create-clinic-endpoint';
import { ClinicResource } from './create-clinic-response';
import { DischargePatientApiEndpoint } from './discharge-patient-endpoint';
import { MyPatientsApiEndpoint } from './my-patients-endpoint';
import { PatientAssembler } from './patient-assembler';
import { PatientResource } from './patient.response';
import { PatientByIdApiEndpoint } from './patient-by-id-endpoint';
import { PhysiotherapistProfileAssembler } from './physiotherapist-profile-assembler';
import { PhysiotherapistProfileResource } from './physiotherapist-profile-response';
import { RegisterPatientApiEndpoint } from './register-patient-endpoint';
import { RegisterPatientCommand } from '../domain/model/register-patient.command';

/**
 * API service for Organization bounded-context operations.
 */
@Injectable({ providedIn: 'root' })
export class OrganizationApi extends BaseApi {
  private readonly createClinicEndpoint: CreateClinicApiEndpoint;
  private readonly currentClinicEndpoint: CurrentClinicApiEndpoint;
  private readonly currentPhysiotherapistEndpoint: CurrentPhysiotherapistApiEndpoint;
  private readonly myPatientsEndpoint: MyPatientsApiEndpoint;
  private readonly patientByIdEndpoint: PatientByIdApiEndpoint;
  private readonly registerPatientEndpoint: RegisterPatientApiEndpoint;
  private readonly dischargePatientEndpoint: DischargePatientApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.createClinicEndpoint = new CreateClinicApiEndpoint(http, new CreateClinicAssembler());
    this.currentClinicEndpoint = new CurrentClinicApiEndpoint(http, new ClinicProfileAssembler());
    this.currentPhysiotherapistEndpoint = new CurrentPhysiotherapistApiEndpoint(
      http,
      new PhysiotherapistProfileAssembler(),
    );
    this.myPatientsEndpoint = new MyPatientsApiEndpoint(http, new PatientAssembler());
    this.patientByIdEndpoint = new PatientByIdApiEndpoint(http, new PatientAssembler());
    this.registerPatientEndpoint = new RegisterPatientApiEndpoint(http, new PatientAssembler());
    this.dischargePatientEndpoint = new DischargePatientApiEndpoint(http);
  }

  createClinic(command: CreateClinicCommand): Observable<ClinicResource> {
    return this.createClinicEndpoint.createClinic(command);
  }

  getCurrentClinic(): Observable<ClinicProfileResource> {
    return this.currentClinicEndpoint.getCurrentClinic();
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
    return this.registerPatientEndpoint.registerPatient(command);
  }

  dischargePatient(id: string): Observable<void> {
    return this.dischargePatientEndpoint.dischargePatient(id);
  }
}
