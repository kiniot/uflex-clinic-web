import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {HttpClient} from '@angular/common/http';
import {PhysiotherapistApiEndpoint} from './physiotherapist-endpoint';
import {PatientApiEndpoint} from './patient-endpoint';
import {PhysiotherapistAssembler} from './physiotherapist-assembler';
import {PatientAssembler} from './patient-assembler';
import {TeamMember} from '../domain/model/team-member.entity';
import {Patient} from '../domain/model/patient.entity';
import {UnassignedPatient} from '../domain/model/unassigned-patient.entity';
import {RegisterPhysiotherapistCommand} from '../domain/model/register-physiotherapist.command';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class OrganizationApi extends BaseApi {
  private readonly physiotherapistEndpoint: PhysiotherapistApiEndpoint;
  private readonly patientEndpoint: PatientApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.physiotherapistEndpoint = new PhysiotherapistApiEndpoint(http, new PhysiotherapistAssembler());
    this.patientEndpoint = new PatientApiEndpoint(http, new PatientAssembler());
  }

  getPhysiotherapists(): Observable<TeamMember[]> {
    return this.physiotherapistEndpoint.getAll();
  }

  getPhysiotherapistById(id: string): Observable<TeamMember> {
    return this.physiotherapistEndpoint.getById(id);
  }

  registerPhysiotherapist(command: RegisterPhysiotherapistCommand): Observable<TeamMember> {
    return this.physiotherapistEndpoint.create(command);
  }

  getPatients(): Observable<Patient[]> {
    return this.patientEndpoint.getAll();
  }

  getMyPatients(): Observable<Patient[]> {
    return this.patientEndpoint.getMyPatients();
  }

  getUnassignedPatients(): Observable<UnassignedPatient[]> {
    return this.patientEndpoint.getUnassignedPatients();
  }

  getPatientById(id: string): Observable<Patient> {
    return this.patientEndpoint.getById(id);
  }

  createPatient(command: {
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
    return this.patientEndpoint.create(command);
  }

  createPatientByPhysiotherapist(command: {
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
    return this.patientEndpoint.createByPhysiotherapist(command);
  }

  assignPatient(patientId: string, physiotherapistId: string): Observable<void> {
    return this.patientEndpoint.assign(patientId, physiotherapistId);
  }

  dischargePatient(patientId: string): Observable<void> {
    return this.patientEndpoint.discharge(patientId);
  }
}