import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { AddRoutineCommand } from '../domain/model/add-routine.command';
import { CreateTreatmentPlanCommand } from '../domain/model/create-treatment-plan.command';
import { UpdateRoutineCommand } from '../domain/model/update-routine.command';
import { UpdateTreatmentPlanCommand } from '../domain/model/update-treatment-plan.command';
import { ActivateTreatmentPlanApiEndpoint } from './activate-treatment-plan-endpoint';
import { AddRoutineApiEndpoint } from './add-routine-endpoint';
import { CancelTreatmentPlanApiEndpoint } from './cancel-treatment-plan-endpoint';
import { CompleteTreatmentPlanApiEndpoint } from './complete-treatment-plan-endpoint';
import { CreateTreatmentPlanApiEndpoint } from './create-treatment-plan-endpoint';
import { DeleteRoutineApiEndpoint } from './delete-routine-endpoint';
import { DeleteTreatmentPlanApiEndpoint } from './delete-treatment-plan-endpoint';
import { TreatmentPlanAssembler } from './treatment-plan-assembler';
import { TreatmentPlanByIdApiEndpoint } from './treatment-plan-by-id-endpoint';
import { TreatmentPlanByPatientAndIdApiEndpoint } from './treatment-plan-by-patient-and-id-endpoint';
import { TreatmentPlanResource } from './treatment-plan.response';
import { TreatmentPlansByPatientApiEndpoint } from './treatment-plans-by-patient-endpoint';
import { UpdateRoutineApiEndpoint } from './update-routine-endpoint';
import { UpdateTreatmentPlanApiEndpoint } from './update-treatment-plan-endpoint';

@Injectable({ providedIn: 'root' })
export class PlanningApi extends BaseApi {
  private readonly treatmentPlansByPatientEndpoint: TreatmentPlansByPatientApiEndpoint;
  private readonly treatmentPlanByPatientAndIdEndpoint: TreatmentPlanByPatientAndIdApiEndpoint;
  private readonly treatmentPlanByIdEndpoint: TreatmentPlanByIdApiEndpoint;
  private readonly createTreatmentPlanEndpoint: CreateTreatmentPlanApiEndpoint;
  private readonly updateTreatmentPlanEndpoint: UpdateTreatmentPlanApiEndpoint;
  private readonly activateTreatmentPlanEndpoint: ActivateTreatmentPlanApiEndpoint;
  private readonly completeTreatmentPlanEndpoint: CompleteTreatmentPlanApiEndpoint;
  private readonly cancelTreatmentPlanEndpoint: CancelTreatmentPlanApiEndpoint;
  private readonly deleteTreatmentPlanEndpoint: DeleteTreatmentPlanApiEndpoint;
  private readonly addRoutineEndpoint: AddRoutineApiEndpoint;
  private readonly updateRoutineEndpoint: UpdateRoutineApiEndpoint;
  private readonly deleteRoutineEndpoint: DeleteRoutineApiEndpoint;

  constructor(http: HttpClient) {
    super();
    const assembler = new TreatmentPlanAssembler();
    this.treatmentPlansByPatientEndpoint = new TreatmentPlansByPatientApiEndpoint(http, assembler);
    this.treatmentPlanByPatientAndIdEndpoint = new TreatmentPlanByPatientAndIdApiEndpoint(
      http,
      assembler,
    );
    this.treatmentPlanByIdEndpoint = new TreatmentPlanByIdApiEndpoint(http, assembler);
    this.createTreatmentPlanEndpoint = new CreateTreatmentPlanApiEndpoint(http, assembler);
    this.updateTreatmentPlanEndpoint = new UpdateTreatmentPlanApiEndpoint(http, assembler);
    this.activateTreatmentPlanEndpoint = new ActivateTreatmentPlanApiEndpoint(http, assembler);
    this.completeTreatmentPlanEndpoint = new CompleteTreatmentPlanApiEndpoint(http, assembler);
    this.cancelTreatmentPlanEndpoint = new CancelTreatmentPlanApiEndpoint(http, assembler);
    this.deleteTreatmentPlanEndpoint = new DeleteTreatmentPlanApiEndpoint(http);
    this.addRoutineEndpoint = new AddRoutineApiEndpoint(http, assembler);
    this.updateRoutineEndpoint = new UpdateRoutineApiEndpoint(http, assembler);
    this.deleteRoutineEndpoint = new DeleteRoutineApiEndpoint(http, assembler);
  }

  getTreatmentPlansByPatient(patientId: string): Observable<TreatmentPlanResource[]> {
    return this.treatmentPlansByPatientEndpoint.getTreatmentPlansByPatient(patientId);
  }

  getTreatmentPlan(patientId: string, planId: string): Observable<TreatmentPlanResource> {
    return this.treatmentPlanByPatientAndIdEndpoint.getTreatmentPlan(patientId, planId);
  }

  getTreatmentPlanById(id: string): Observable<TreatmentPlanResource> {
    return this.treatmentPlanByIdEndpoint.getTreatmentPlanById(id);
  }

  createTreatmentPlan(
    patientId: string,
    command: CreateTreatmentPlanCommand,
  ): Observable<TreatmentPlanResource> {
    return this.createTreatmentPlanEndpoint.createTreatmentPlan(patientId, command);
  }

  updateTreatmentPlan(id: string, command: UpdateTreatmentPlanCommand): Observable<TreatmentPlanResource> {
    return this.updateTreatmentPlanEndpoint.updateTreatmentPlan(id, command);
  }

  activateTreatmentPlan(id: string): Observable<TreatmentPlanResource> {
    return this.activateTreatmentPlanEndpoint.activateTreatmentPlan(id);
  }

  completeTreatmentPlan(id: string): Observable<TreatmentPlanResource> {
    return this.completeTreatmentPlanEndpoint.completeTreatmentPlan(id);
  }

  cancelTreatmentPlan(id: string): Observable<TreatmentPlanResource> {
    return this.cancelTreatmentPlanEndpoint.cancelTreatmentPlan(id);
  }

  deleteTreatmentPlan(id: string): Observable<void> {
    return this.deleteTreatmentPlanEndpoint.deleteTreatmentPlan(id);
  }

  addRoutine(treatmentPlanId: string, command: AddRoutineCommand): Observable<TreatmentPlanResource> {
    return this.addRoutineEndpoint.addRoutine(treatmentPlanId, command);
  }

  updateRoutine(
    treatmentPlanId: string,
    routineOrder: number,
    command: UpdateRoutineCommand,
  ): Observable<TreatmentPlanResource> {
    return this.updateRoutineEndpoint.updateRoutine(treatmentPlanId, routineOrder, command);
  }

  deleteRoutine(treatmentPlanId: string, routineOrder: number): Observable<TreatmentPlanResource> {
    return this.deleteRoutineEndpoint.deleteRoutine(treatmentPlanId, routineOrder);
  }
}
