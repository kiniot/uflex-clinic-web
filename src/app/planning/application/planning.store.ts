import {Injectable, signal} from '@angular/core';
import {Patient} from '../domain/model/patient.entity';
import {MOCK_PATIENTS} from '../infrastructure/patient.mock';

/**
 * Application-layer store for the Planning bounded context. Currently
 * exposes the patient roster used by other contexts (e.g. Device's
 * Link to Patient flow). Hydrated from a mock until the backend lands.
 */
@Injectable({providedIn: 'root'})
export class PlanningStore {
  private readonly patientsSignal = signal<Patient[]>(MOCK_PATIENTS);

  readonly patients = this.patientsSignal.asReadonly();
}
