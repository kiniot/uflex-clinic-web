import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ClinicalAlert } from '../domain/model/clinical-alert.entity';
import { ClinicalMetrics } from '../domain/model/clinical-metrics';
import { AddRoutineCommand } from '../domain/model/add-routine.command';
import { CreateExerciseCommand } from '../domain/model/create-exercise.command';
import { CreateTreatmentPlanCommand } from '../domain/model/create-treatment-plan.command';
import { ExerciseCatalogItem } from '../domain/model/exercise-catalog-item.entity';
import { Patient } from '../domain/model/patient.entity';
import { Session } from '../domain/model/session.entity';
import { TreatmentPlanRoutine } from '../domain/model/treatment-plan-routine.entity';
import { TreatmentPlan } from '../domain/model/treatment-plan.entity';
import { UpdateExerciseCommand } from '../domain/model/update-exercise.command';
import { UpdateRoutineCommand } from '../domain/model/update-routine.command';
import { UpdateTreatmentPlanCommand } from '../domain/model/update-treatment-plan.command';
import { MOCK_CLINICAL_ALERTS } from '../infrastructure/clinical-alert.mock';
import { MOCK_CLINICAL_METRICS } from '../infrastructure/clinical-metrics.mock';
import { MOCK_PATIENTS } from '../infrastructure/patient.mock';
import { PlanningApi } from '../infrastructure/planning-api';
import { TreatmentPlanFilters } from '../infrastructure/all-treatment-plans-endpoint';
import { MOCK_DAILY_SESSIONS } from '../infrastructure/session.mock';
import { ExerciseCatalogItemResource } from '../infrastructure/exercise-catalog-item.response';
import { TreatmentPlanResource } from '../infrastructure/treatment-plan.response';

/**
 * Application-layer store for the Planning bounded context. Exposes the
 * patient roster (consumed by Device's Link to Patient flow) plus the
 * scheduling, alerting, and metrics signals that drive the
 * physiotherapist dashboard. Hydrated from mocks until the backend
 * lands.
 */
@Injectable({ providedIn: 'root' })
export class PlanningStore {
  private readonly patientsSignal = signal<Patient[]>(MOCK_PATIENTS);
  private readonly dailySessionsSignal = signal<Session[]>(MOCK_DAILY_SESSIONS);
  private readonly alertsSignal = signal<ClinicalAlert[]>(MOCK_CLINICAL_ALERTS);
  private readonly metricsSignal = signal<ClinicalMetrics>(MOCK_CLINICAL_METRICS);
  private readonly allTreatmentPlansSignal = signal<TreatmentPlan[]>([]);
  private readonly loadingAllTreatmentPlansSignal = signal(false);
  private readonly patientTreatmentPlansSignal = signal<TreatmentPlan[]>([]);
  private readonly selectedTreatmentPlanSignal = signal<TreatmentPlan | null>(null);
  private readonly loadingTreatmentPlansSignal = signal(false);
  private readonly loadingSelectedTreatmentPlanSignal = signal(false);
  private readonly exerciseCatalogSignal = signal<ExerciseCatalogItem[]>([]);
  private readonly selectedExerciseCatalogItemSignal = signal<ExerciseCatalogItem | null>(null);
  private readonly loadingExerciseCatalogSignal = signal(false);
  private readonly loadingSelectedExerciseCatalogItemSignal = signal(false);
  private readonly exerciseCatalogErrorSignal = signal<string | null>(null);
  private readonly savingExerciseSignal = signal(false);
  private readonly deletingExerciseSignal = signal(false);

  readonly patients = this.patientsSignal.asReadonly();
  readonly dailySessions = this.dailySessionsSignal.asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly metrics = this.metricsSignal.asReadonly();
  readonly allTreatmentPlans = this.allTreatmentPlansSignal.asReadonly();
  readonly isLoadingAllTreatmentPlans = this.loadingAllTreatmentPlansSignal.asReadonly();
  readonly patientTreatmentPlans = this.patientTreatmentPlansSignal.asReadonly();
  readonly selectedTreatmentPlan = this.selectedTreatmentPlanSignal.asReadonly();
  readonly isLoadingTreatmentPlans = this.loadingTreatmentPlansSignal.asReadonly();
  readonly isLoadingSelectedTreatmentPlan = this.loadingSelectedTreatmentPlanSignal.asReadonly();
  readonly exerciseCatalog = this.exerciseCatalogSignal.asReadonly();
  readonly selectedExerciseCatalogItem = this.selectedExerciseCatalogItemSignal.asReadonly();
  readonly isLoadingExerciseCatalog = this.loadingExerciseCatalogSignal.asReadonly();
  readonly isLoadingSelectedExerciseCatalogItem =
    this.loadingSelectedExerciseCatalogItemSignal.asReadonly();
  readonly exerciseCatalogError = this.exerciseCatalogErrorSignal.asReadonly();
  readonly isSavingExercise = this.savingExerciseSignal.asReadonly();
  readonly isDeletingExercise = this.deletingExerciseSignal.asReadonly();

  constructor(private planningApi: PlanningApi) {}

  /**
   * Loads every treatment plan visible to the current physiotherapist
   * (clinic-wide, filterable). Backs the Planning hub table.
   */
  async loadAllTreatmentPlans(filters?: TreatmentPlanFilters): Promise<TreatmentPlan[]> {
    this.loadingAllTreatmentPlansSignal.set(true);
    try {
      const resources = await firstValueFrom(this.planningApi.getAllTreatmentPlans(filters));
      const plans = resources.map((resource) => this.mapTreatmentPlan(resource));
      this.allTreatmentPlansSignal.set(plans);
      return plans;
    } finally {
      this.loadingAllTreatmentPlansSignal.set(false);
    }
  }

  async loadTreatmentPlansByPatient(patientId: string): Promise<TreatmentPlan[]> {
    this.loadingTreatmentPlansSignal.set(true);
    try {
      const resources = await firstValueFrom(
        this.planningApi.getTreatmentPlansByPatient(patientId),
      );
      const plans = resources.map((resource) => this.mapTreatmentPlan(resource));
      this.patientTreatmentPlansSignal.set(plans);
      return plans;
    } finally {
      this.loadingTreatmentPlansSignal.set(false);
    }
  }

  async loadTreatmentPlan(patientId: string, planId: string): Promise<TreatmentPlan | null> {
    if (planId === 'new') {
      this.selectedTreatmentPlanSignal.set(null);
      return null;
    }

    this.loadingSelectedTreatmentPlanSignal.set(true);
    try {
      const resource = await firstValueFrom(this.planningApi.getTreatmentPlan(patientId, planId));
      const plan = this.mapTreatmentPlan(resource);
      this.selectedTreatmentPlanSignal.set(plan);
      return plan;
    } finally {
      this.loadingSelectedTreatmentPlanSignal.set(false);
    }
  }

  async createTreatmentPlan(
    patientId: string,
    command: CreateTreatmentPlanCommand,
  ): Promise<TreatmentPlan> {
    const resource = await firstValueFrom(this.planningApi.createTreatmentPlan(patientId, command));
    const plan = this.mapTreatmentPlan(resource);
    this.patientTreatmentPlansSignal.update((plans) => [plan, ...plans]);
    this.selectedTreatmentPlanSignal.set(plan);
    return plan;
  }

  async updateTreatmentPlan(
    id: string,
    command: UpdateTreatmentPlanCommand,
  ): Promise<TreatmentPlan> {
    const resource = await firstValueFrom(this.planningApi.updateTreatmentPlan(id, command));
    return this.syncTreatmentPlan(resource);
  }

  async activateTreatmentPlan(id: string): Promise<TreatmentPlan> {
    const resource = await firstValueFrom(this.planningApi.activateTreatmentPlan(id));
    return this.syncTreatmentPlan(resource);
  }

  async completeTreatmentPlan(id: string): Promise<TreatmentPlan> {
    const resource = await firstValueFrom(this.planningApi.completeTreatmentPlan(id));
    return this.syncTreatmentPlan(resource);
  }

  async cancelTreatmentPlan(id: string): Promise<TreatmentPlan> {
    const resource = await firstValueFrom(this.planningApi.cancelTreatmentPlan(id));
    return this.syncTreatmentPlan(resource);
  }

  async deleteTreatmentPlan(id: string): Promise<void> {
    await firstValueFrom(this.planningApi.deleteTreatmentPlan(id));
    this.patientTreatmentPlansSignal.update((plans) => plans.filter((plan) => plan.id !== id));
    if (this.selectedTreatmentPlanSignal()?.id === id) {
      this.selectedTreatmentPlanSignal.set(null);
    }
  }

  async addRoutine(treatmentPlanId: string, command: AddRoutineCommand): Promise<TreatmentPlan> {
    const resource = await firstValueFrom(this.planningApi.addRoutine(treatmentPlanId, command));
    return this.syncTreatmentPlan(resource);
  }

  async updateRoutine(
    treatmentPlanId: string,
    routineOrder: number,
    command: UpdateRoutineCommand,
  ): Promise<TreatmentPlan> {
    const resource = await firstValueFrom(
      this.planningApi.updateRoutine(treatmentPlanId, routineOrder, command),
    );
    return this.syncTreatmentPlan(resource);
  }

  async deleteRoutine(treatmentPlanId: string, routineOrder: number): Promise<TreatmentPlan> {
    const resource = await firstValueFrom(
      this.planningApi.deleteRoutine(treatmentPlanId, routineOrder),
    );
    return this.syncTreatmentPlan(resource);
  }

  async loadExerciseCatalog(): Promise<ExerciseCatalogItem[]> {
    this.loadingExerciseCatalogSignal.set(true);
    this.exerciseCatalogErrorSignal.set(null);
    try {
      const resources = await firstValueFrom(this.planningApi.getExercises());
      const exercises = resources.map((resource) => this.mapExerciseCatalogItem(resource));
      this.exerciseCatalogSignal.set(exercises);
      return exercises;
    } catch (error) {
      this.exerciseCatalogSignal.set([]);
      this.exerciseCatalogErrorSignal.set(this.describeError(error));
      return [];
    } finally {
      this.loadingExerciseCatalogSignal.set(false);
    }
  }

  async loadExerciseById(id: string): Promise<ExerciseCatalogItem | null> {
    const existing = this.exerciseCatalog().find((item) => item.id === id);
    if (existing) {
      this.selectedExerciseCatalogItemSignal.set(existing);
      return existing;
    }

    this.loadingSelectedExerciseCatalogItemSignal.set(true);
    try {
      const resource = await firstValueFrom(this.planningApi.getExerciseById(id));
      const exercise = this.mapExerciseCatalogItem(resource);
      this.selectedExerciseCatalogItemSignal.set(exercise);
      this.exerciseCatalogSignal.update((items) =>
        items.some((item) => item.id === exercise.id) ? items : [...items, exercise],
      );
      return exercise;
    } finally {
      this.loadingSelectedExerciseCatalogItemSignal.set(false);
    }
  }

  async createExercise(command: CreateExerciseCommand): Promise<ExerciseCatalogItem> {
    this.savingExerciseSignal.set(true);
    try {
      const resource = await firstValueFrom(this.planningApi.createExercise(command));
      const exercise = this.mapExerciseCatalogItem(resource);
      this.exerciseCatalogSignal.update((items) => [exercise, ...items]);
      this.selectedExerciseCatalogItemSignal.set(exercise);
      return exercise;
    } finally {
      this.savingExerciseSignal.set(false);
    }
  }

  async updateExercise(id: string, command: UpdateExerciseCommand): Promise<ExerciseCatalogItem> {
    this.savingExerciseSignal.set(true);
    try {
      const resource = await firstValueFrom(this.planningApi.updateExercise(id, command));
      const exercise = this.mapExerciseCatalogItem(resource);
      this.selectedExerciseCatalogItemSignal.set(exercise);
      this.exerciseCatalogSignal.update((items) =>
        items.some((item) => item.id === exercise.id)
          ? items.map((item) => (item.id === exercise.id ? exercise : item))
          : [exercise, ...items],
      );
      return exercise;
    } finally {
      this.savingExerciseSignal.set(false);
    }
  }

  async deleteExercise(id: string): Promise<void> {
    this.deletingExerciseSignal.set(true);
    try {
      await firstValueFrom(this.planningApi.deleteExercise(id));
      this.exerciseCatalogSignal.update((items) => items.filter((item) => item.id !== id));
      if (this.selectedExerciseCatalogItemSignal()?.id === id) {
        this.selectedExerciseCatalogItemSignal.set(null);
      }
    } finally {
      this.deletingExerciseSignal.set(false);
    }
  }

  clearSelectedExerciseCatalogItem() {
    this.selectedExerciseCatalogItemSignal.set(null);
  }

  private syncTreatmentPlan(resource: TreatmentPlanResource): TreatmentPlan {
    const plan = this.mapTreatmentPlan(resource);
    this.patientTreatmentPlansSignal.update((plans) => {
      const existing = plans.some((item) => item.id === plan.id);
      return existing ? plans.map((item) => (item.id === plan.id ? plan : item)) : [plan, ...plans];
    });
    this.selectedTreatmentPlanSignal.set(plan);
    return plan;
  }

  private mapTreatmentPlan(resource: TreatmentPlanResource): TreatmentPlan {
    return new TreatmentPlan({
      id: resource.id,
      patientId: resource.patientId,
      name: resource.name,
      status: resource.status,
      period: resource.period,
      routines: resource.routines.map(
        (routine) =>
          new TreatmentPlanRoutine({
            id: routine.id ?? '',
            name: routine.name,
            order: routine.order,
            schedule: routine.schedule,
            exerciseSeries: routine.exerciseSeries,
          }),
      ),
    });
  }

  private mapExerciseCatalogItem(resource: ExerciseCatalogItemResource): ExerciseCatalogItem {
    return new ExerciseCatalogItem({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      bodyPart: resource.bodyPart,
      movementType: resource.movementType,
      videoUrl: resource.videoUrl,
    });
  }

  private describeError(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'Failed to load exercises';
  }
}
