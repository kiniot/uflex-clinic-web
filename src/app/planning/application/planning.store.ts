import {Injectable, computed, signal} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {ClinicalAlert} from '../domain/model/clinical-alert.entity';
import {ClinicalMetrics} from '../domain/model/clinical-metrics';
import {ClinicalTrajectory} from '../domain/model/clinical-trajectory';
import { AddRoutineCommand } from '../domain/model/add-routine.command';
import { CreateTreatmentPlanCommand } from '../domain/model/create-treatment-plan.command';
import {Patient} from '../domain/model/patient.entity';
import {RehabProgram} from '../domain/model/rehab-program.entity';
import {RoutineExercise} from '../domain/model/routine-exercise.entity';
import {Session} from '../domain/model/session.entity';
import { TreatmentPlanRoutine } from '../domain/model/treatment-plan-routine.entity';
import { TreatmentPlan } from '../domain/model/treatment-plan.entity';
import { UpdateRoutineCommand } from '../domain/model/update-routine.command';
import { UpdateTreatmentPlanCommand } from '../domain/model/update-treatment-plan.command';
import {MOCK_CLINICAL_ALERTS} from '../infrastructure/clinical-alert.mock';
import {MOCK_CLINICAL_METRICS} from '../infrastructure/clinical-metrics.mock';
import {MOCK_CLINICAL_TRAJECTORY} from '../infrastructure/clinical-trajectory.mock';
import {MOCK_PATIENTS} from '../infrastructure/patient.mock';
import { PlanningApi } from '../infrastructure/planning-api';
import {MOCK_REHAB_PROGRAM} from '../infrastructure/rehab-program.mock';
import {MOCK_DAILY_SESSIONS} from '../infrastructure/session.mock';
import { TreatmentPlanResource } from '../infrastructure/treatment-plan.response';

/**
 * Application-layer store for the Planning bounded context. Exposes the
 * patient roster (consumed by Device's Link to Patient flow) plus the
 * scheduling, alerting, and metrics signals that drive the
 * physiotherapist dashboard. Hydrated from mocks until the backend
 * lands.
 */
@Injectable({providedIn: 'root'})
export class PlanningStore {
  private readonly patientsSignal = signal<Patient[]>(MOCK_PATIENTS);
  private readonly dailySessionsSignal = signal<Session[]>(MOCK_DAILY_SESSIONS);
  private readonly alertsSignal = signal<ClinicalAlert[]>(MOCK_CLINICAL_ALERTS);
  private readonly metricsSignal = signal<ClinicalMetrics>(MOCK_CLINICAL_METRICS);
  private readonly rehabProgramSignal = signal<RehabProgram>(MOCK_REHAB_PROGRAM);
  private readonly trajectorySignal = signal<ClinicalTrajectory>(MOCK_CLINICAL_TRAJECTORY);
  private readonly patientTreatmentPlansSignal = signal<TreatmentPlan[]>([]);
  private readonly selectedTreatmentPlanSignal = signal<TreatmentPlan | null>(null);
  private readonly loadingTreatmentPlansSignal = signal(false);
  private readonly loadingSelectedTreatmentPlanSignal = signal(false);

  readonly patients = this.patientsSignal.asReadonly();
  readonly dailySessions = this.dailySessionsSignal.asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly metrics = this.metricsSignal.asReadonly();
  readonly rehabProgram = this.rehabProgramSignal.asReadonly();
  readonly trajectory = this.trajectorySignal.asReadonly();
  readonly patientTreatmentPlans = this.patientTreatmentPlansSignal.asReadonly();
  readonly selectedTreatmentPlan = this.selectedTreatmentPlanSignal.asReadonly();
  readonly isLoadingTreatmentPlans = this.loadingTreatmentPlansSignal.asReadonly();
  readonly isLoadingSelectedTreatmentPlan = this.loadingSelectedTreatmentPlanSignal.asReadonly();

  constructor(private planningApi: PlanningApi) {}

  readonly programProgressPct = computed(() => {
    const p = this.rehabProgram();
    if (p.totalDays === 0) return 0;
    return Math.round((p.dayNumber / p.totalDays) * 100);
  });

  /**
   * Adjusts a counter parameter on a routine exercise by `delta`. Only
   * counter parameters mutate; static ones (e.g. INTENSITY: MODERATE)
   * are read-only and ignored.
   */
  adjustRoutineParam(exerciseId: number, paramKey: string, delta: number) {
    this.rehabProgramSignal.update(program => {
      const nextRoutine = program.routineExercises.map(ex => {
        if (ex.id !== exerciseId) return ex;
        const nextParams = ex.parameters.map(p =>
          p.key === paramKey && p.type === 'counter'
            ? {...p, value: Math.max(0, p.value + delta)}
            : p
        );
        return new RoutineExercise({
          id: ex.id,
          name: ex.name,
          description: ex.description,
          parameters: nextParams
        });
      });
      return this.cloneProgramWithRoutine(program, nextRoutine);
    });
  }

  /** Removes a routine exercise from the active program. */
  removeRoutineExercise(exerciseId: number) {
    this.rehabProgramSignal.update(program => {
      const nextRoutine = program.routineExercises.filter(ex => ex.id !== exerciseId);
      return this.cloneProgramWithRoutine(program, nextRoutine);
    });
  }

  private cloneProgramWithRoutine(program: RehabProgram, routine: RoutineExercise[]): RehabProgram {
    return new RehabProgram({
      id: program.id,
      patientName: program.patientName,
      patientAge: program.patientAge,
      patientGender: program.patientGender,
      patientCondition: program.patientCondition,
      phases: program.phases,
      currentPhase: program.currentPhase,
      dayNumber: program.dayNumber,
      totalDays: program.totalDays,
      scheduleLabel: program.scheduleLabel,
      routineExercises: routine
    });
  }

  async loadTreatmentPlansByPatient(patientId: string): Promise<TreatmentPlan[]> {
    this.loadingTreatmentPlansSignal.set(true);
    try {
      const resources = await firstValueFrom(this.planningApi.getTreatmentPlansByPatient(patientId));
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

  async updateTreatmentPlan(id: string, command: UpdateTreatmentPlanCommand): Promise<TreatmentPlan> {
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
    const resource = await firstValueFrom(this.planningApi.deleteRoutine(treatmentPlanId, routineOrder));
    return this.syncTreatmentPlan(resource);
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
}
