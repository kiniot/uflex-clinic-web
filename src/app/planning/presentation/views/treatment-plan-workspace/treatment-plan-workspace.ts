import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { OrganizationStore } from '../../../../organization/application/organization.store';
import { AddRoutineCommand } from '../../../domain/model/add-routine.command';
import { CreateTreatmentPlanCommand } from '../../../domain/model/create-treatment-plan.command';
import { ExerciseCatalogItem } from '../../../domain/model/exercise-catalog-item.entity';
import { TreatmentPlanRoutine } from '../../../domain/model/treatment-plan-routine.entity';
import { TreatmentPlan } from '../../../domain/model/treatment-plan.entity';
import {
  TreatmentPlanDayOfWeek,
  TreatmentPlanStatus,
} from '../../../domain/model/treatment-plan.types';
import { UpdateRoutineCommand } from '../../../domain/model/update-routine.command';
import { UpdateTreatmentPlanCommand } from '../../../domain/model/update-treatment-plan.command';
import { PlanningStore } from '../../../application/planning.store';

interface SelectOption<T> {
  label: string;
  value: T;
}

interface ExerciseSeriesDraft {
  localKey: number;
  order: number;
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  movementType: string;
  videoUrl: string | null;
  rangeOfMotionDegrees: number;
  repetitions: number;
  durationSeconds: number;
  restDurationSeconds: number;
}

interface RoutineDraft {
  localKey: number;
  backendId: string;
  originalOrder: number | null;
  name: string;
  order: number;
  scheduleDayOfWeek: string;
  scheduleTime: string;
  exerciseSeries: ExerciseSeriesDraft[];
}

@Component({
  selector: 'app-treatment-plan-workspace',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './treatment-plan-workspace.html',
  styleUrl: './treatment-plan-workspace.scss',
})
export class TreatmentPlanWorkspace {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly organizationStore = inject(OrganizationStore);
  private readonly planningStore = inject(PlanningStore);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  private routineLocalKey = 1;
  private seriesLocalKey = 1;

  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  private readonly translations = toSignal(
    this.translate.stream([
      'treatmentPlanWorkspace.dayOptions.MONDAY',
      'treatmentPlanWorkspace.dayOptions.TUESDAY',
      'treatmentPlanWorkspace.dayOptions.WEDNESDAY',
      'treatmentPlanWorkspace.dayOptions.THURSDAY',
      'treatmentPlanWorkspace.dayOptions.FRIDAY',
      'treatmentPlanWorkspace.dayOptions.SATURDAY',
      'treatmentPlanWorkspace.dayOptions.SUNDAY',
      'treatmentPlanWorkspace.movementLabels.PRONATION',
      'treatmentPlanWorkspace.movementLabels.SUPINATION',
      'treatmentPlanWorkspace.movementLabels.FLEXION',
      'treatmentPlanWorkspace.movementLabels.EXTENSION',
      'treatmentPlanWorkspace.movementLabels.ELBOW',
      'treatmentPlanWorkspace.movementLabels.WRIST',
      'treatmentPlanWorkspace.bodyPartLabels.ELBOW',
      'treatmentPlanWorkspace.bodyPartLabels.WRIST',
    ]),
    { initialValue: {} as Record<string, string> },
  );

  private readonly originalPlanSignal = signal<TreatmentPlan | null>(null);
  private readonly selectedRoutineLocalKeySignal = signal<number | null>(null);
  private readonly routineDraftsSignal = signal<RoutineDraft[]>([]);
  private readonly savingSignal = signal(false);
  private readonly runningTransitionSignal = signal(false);
  private lastCatalogErrorMessage: string | null = null;

  protected readonly patient = this.organizationStore.selectedPatient;
  protected readonly treatmentPlan = this.planningStore.selectedTreatmentPlan;
  protected readonly exerciseCatalog = this.planningStore.exerciseCatalog;
  protected readonly isLoadingExerciseCatalog = this.planningStore.isLoadingExerciseCatalog;
  protected readonly exerciseCatalogError = this.planningStore.exerciseCatalogError;
  protected readonly isLoadingPlan = this.planningStore.isLoadingSelectedTreatmentPlan;
  protected readonly routines = this.routineDraftsSignal.asReadonly();
  protected readonly selectedRoutineLocalKey = this.selectedRoutineLocalKeySignal.asReadonly();
  protected readonly isSaving = this.savingSignal.asReadonly();
  protected readonly isRunningTransition = this.runningTransitionSignal.asReadonly();
  protected readonly loadingRows = [0, 1, 2];

  protected readonly dayOptions = computed<SelectOption<TreatmentPlanDayOfWeek>[]>(() => [
    {
      label: this.translations()['treatmentPlanWorkspace.dayOptions.MONDAY'] ?? 'Monday',
      value: 'MONDAY',
    },
    {
      label: this.translations()['treatmentPlanWorkspace.dayOptions.TUESDAY'] ?? 'Tuesday',
      value: 'TUESDAY',
    },
    {
      label: this.translations()['treatmentPlanWorkspace.dayOptions.WEDNESDAY'] ?? 'Wednesday',
      value: 'WEDNESDAY',
    },
    {
      label: this.translations()['treatmentPlanWorkspace.dayOptions.THURSDAY'] ?? 'Thursday',
      value: 'THURSDAY',
    },
    {
      label: this.translations()['treatmentPlanWorkspace.dayOptions.FRIDAY'] ?? 'Friday',
      value: 'FRIDAY',
    },
    {
      label: this.translations()['treatmentPlanWorkspace.dayOptions.SATURDAY'] ?? 'Saturday',
      value: 'SATURDAY',
    },
    {
      label: this.translations()['treatmentPlanWorkspace.dayOptions.SUNDAY'] ?? 'Sunday',
      value: 'SUNDAY',
    },
  ]);

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startsAt: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endsAt: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly patientId = computed(() => this.routeParams().get('patientId') ?? '');
  protected readonly planId = computed(() => this.routeParams().get('planId') ?? '');
  protected readonly isCreateMode = computed(() => this.planId() === 'new');
  protected readonly pageTitle = computed(() =>
    this.isCreateMode() ? 'treatmentPlanWorkspace.createTitle' : 'treatmentPlanWorkspace.editTitle',
  );
  protected readonly activeStatus = computed(() =>
    this.isCreateMode() ? 'SCHEDULED' : (this.originalPlanSignal()?.status ?? 'SCHEDULED'),
  );
  protected readonly canEditStructure = computed(() => {
    const status = this.activeStatus();
    return status !== 'COMPLETED' && status !== 'CANCELED';
  });
  protected readonly selectedRoutine = computed(
    () =>
      this.routines().find((routine) => routine.localKey === this.selectedRoutineLocalKey()) ??
      null,
  );

  constructor() {
    effect(() => {
      const patientId = this.patientId();
      const planId = this.planId();
      if (!patientId || !planId) return;
      void this.loadWorkspace(patientId, planId);
    });

    effect(() => {
      const errorMessage = this.exerciseCatalogError();
      if (!errorMessage || errorMessage === this.lastCatalogErrorMessage) return;

      this.lastCatalogErrorMessage = errorMessage;
      this.messageService.add({
        severity: 'warn',
        summary: this.translate.instant(
          'treatmentPlanWorkspace.notifications.catalogLoadErrorSummary',
        ),
        detail: this.translate.instant(
          'treatmentPlanWorkspace.notifications.catalogLoadErrorDetail',
        ),
        life: 4500,
      });
    });
  }

  protected onSelectRoutine(localKey: number) {
    this.selectedRoutineLocalKeySignal.set(localKey);
  }

  protected onAddRoutine() {
    if (!this.canEditStructure()) return;
    const nextOrder = this.nextRoutineOrder();
    const draft: RoutineDraft = {
      localKey: this.routineLocalKey++,
      backendId: '',
      originalOrder: null,
      name: '',
      order: nextOrder,
      scheduleDayOfWeek: 'MONDAY',
      scheduleTime: '08:00:00',
      exerciseSeries: [],
    };
    this.routineDraftsSignal.update((routines) => [...routines, draft]);
    this.selectedRoutineLocalKeySignal.set(draft.localKey);
  }

  protected onRemoveRoutine(localKey: number) {
    if (!this.canEditStructure()) return;
    this.routineDraftsSignal.update((routines) =>
      this.resequenceRoutines(routines.filter((routine) => routine.localKey !== localKey)),
    );
    if (this.selectedRoutineLocalKey() === localKey) {
      this.selectedRoutineLocalKeySignal.set(this.routineDraftsSignal()[0]?.localKey ?? null);
    }
  }

  protected onRoutineActionClick(event: Event) {
    event.stopPropagation();
  }

  protected onRoutineKeySelect(event: Event, localKey: number) {
    event.preventDefault();
    this.onSelectRoutine(localKey);
  }

  protected onRemoveRoutineClick(event: Event, localKey: number) {
    this.onRoutineActionClick(event);
    this.onRemoveRoutine(localKey);
  }

  protected onRemoveSeriesClick(event: Event, routineLocalKey: number, seriesLocalKey: number) {
    this.onRoutineActionClick(event);
    this.onRemoveSeries(routineLocalKey, seriesLocalKey);
  }

  protected onAddExerciseToRoutine(exercise: ExerciseCatalogItem) {
    if (!this.canEditStructure()) return;
    const selectedKey = this.selectedRoutineLocalKey();
    if (selectedKey == null) return;

    this.routineDraftsSignal.update((routines) =>
      routines.map((routine) => {
        if (routine.localKey !== selectedKey) return routine;

        const nextOrder = routine.exerciseSeries.length + 1;
        const nextSeries: ExerciseSeriesDraft = {
          localKey: this.seriesLocalKey++,
          order: nextOrder,
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          bodyPart: exercise.bodyPart,
          movementType: exercise.movementType,
          videoUrl: exercise.videoUrl,
          rangeOfMotionDegrees: 0,
          repetitions: 1,
          durationSeconds: 0,
          restDurationSeconds: 0,
        };

        return {
          ...routine,
          exerciseSeries: [...routine.exerciseSeries, nextSeries],
        };
      }),
    );
  }

  protected onRemoveSeries(routineLocalKey: number, seriesLocalKey: number) {
    if (!this.canEditStructure()) return;
    this.routineDraftsSignal.update((routines) =>
      routines.map((routine) => {
        if (routine.localKey !== routineLocalKey) return routine;

        return {
          ...routine,
          exerciseSeries: routine.exerciseSeries
            .filter((series) => series.localKey !== seriesLocalKey)
            .map((series, index) => ({ ...series, order: index + 1 })),
        };
      }),
    );
  }

  protected onRetryExerciseCatalog() {
    this.lastCatalogErrorMessage = null;
    void this.planningStore.loadExerciseCatalog();
  }

  protected onSavePlan() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const patientId = this.patientId();
    if (!patientId) return;

    void this.persistWorkspace(patientId);
  }

  protected onDeletePlan() {
    const planId = this.originalPlanSignal()?.id;
    const patientId = this.patientId();
    if (!planId || !patientId) return;

    void this.runTransition(async () => {
      await this.planningStore.deleteTreatmentPlan(planId);
      await this.planningStore.loadTreatmentPlansByPatient(patientId);
      this.notifySuccess(
        'treatmentPlanWorkspace.notifications.deleteSuccessSummary',
        'treatmentPlanWorkspace.notifications.deleteSuccessDetail',
      );
      await this.router.navigate(['/physiotherapist/patients', patientId]);
    });
  }

  protected onActivatePlan() {
    const planId = this.originalPlanSignal()?.id;
    const patientId = this.patientId();
    if (!planId || !patientId) return;

    void this.runTransition(async () => {
      const updated = await this.planningStore.activateTreatmentPlan(planId);
      await this.afterPlanMutation(patientId, updated.id);
      this.notifySuccess(
        'treatmentPlanWorkspace.notifications.activateSuccessSummary',
        'treatmentPlanWorkspace.notifications.activateSuccessDetail',
      );
    });
  }

  protected onCompletePlan() {
    const planId = this.originalPlanSignal()?.id;
    const patientId = this.patientId();
    if (!planId || !patientId) return;

    void this.runTransition(async () => {
      const updated = await this.planningStore.completeTreatmentPlan(planId);
      await this.afterPlanMutation(patientId, updated.id);
      this.notifySuccess(
        'treatmentPlanWorkspace.notifications.completeSuccessSummary',
        'treatmentPlanWorkspace.notifications.completeSuccessDetail',
      );
    });
  }

  protected onCancelPlan() {
    const planId = this.originalPlanSignal()?.id;
    const patientId = this.patientId();
    if (!planId || !patientId) return;

    void this.runTransition(async () => {
      const updated = await this.planningStore.cancelTreatmentPlan(planId);
      await this.afterPlanMutation(patientId, updated.id);
      this.notifySuccess(
        'treatmentPlanWorkspace.notifications.cancelSuccessSummary',
        'treatmentPlanWorkspace.notifications.cancelSuccessDetail',
      );
    });
  }

  protected movementLabel(movementType: string): string {
    return (
      this.translations()[`treatmentPlanWorkspace.movementLabels.${movementType}`] ?? movementType
    );
  }

  protected bodyPartLabel(bodyPart: string): string {
    return this.translations()[`treatmentPlanWorkspace.bodyPartLabels.${bodyPart}`] ?? bodyPart;
  }

  protected trackRoutine(index: number, routine: RoutineDraft): number {
    return routine.localKey;
  }

  protected trackSeries(index: number, series: ExerciseSeriesDraft): number {
    return series.localKey;
  }

  private async loadWorkspace(patientId: string, planId: string): Promise<void> {
    await Promise.all([
      this.organizationStore.loadCurrentClinicOnce(),
      this.organizationStore.loadCurrentPhysiotherapistOnce(),
      this.organizationStore.loadPatientById(patientId),
      this.planningStore.loadExerciseCatalog(),
    ]);

    if (planId === 'new') {
      this.originalPlanSignal.set(null);
      this.form.reset(
        {
          name: '',
          startsAt: '',
          endsAt: '',
        },
        { emitEvent: false },
      );
      this.routineDraftsSignal.set([]);
      this.selectedRoutineLocalKeySignal.set(null);
      return;
    }

    const plan = await this.planningStore.loadTreatmentPlan(patientId, planId);
    this.originalPlanSignal.set(plan);
    this.patchDraftFromPlan(plan);
  }

  private patchDraftFromPlan(plan: TreatmentPlan | null): void {
    if (!plan) return;

    this.form.reset(
      {
        name: plan.name,
        startsAt: plan.period.startsAt,
        endsAt: plan.period.endsAt,
      },
      { emitEvent: false },
    );

    const routines = plan.routines
      .slice()
      .sort((left, right) => left.order - right.order)
      .map((routine) => this.toRoutineDraft(routine));

    this.routineDraftsSignal.set(routines);
    this.selectedRoutineLocalKeySignal.set(routines[0]?.localKey ?? null);
  }

  private toRoutineDraft(routine: TreatmentPlanRoutine): RoutineDraft {
    return {
      localKey: this.routineLocalKey++,
      backendId: routine.id,
      originalOrder: routine.order,
      name: routine.name,
      order: routine.order,
      scheduleDayOfWeek: routine.schedule.dayOfWeek,
      scheduleTime: routine.schedule.scheduledTime,
      exerciseSeries: routine.exerciseSeries
        .slice()
        .sort((left, right) => left.order - right.order)
        .map((series) => {
          const exercise = this.exerciseCatalog().find((item) => item.id === series.exerciseId);
          return {
            localKey: this.seriesLocalKey++,
            order: series.order,
            exerciseId: series.exerciseId,
            exerciseName: exercise?.name ?? series.exerciseId,
            bodyPart: exercise?.bodyPart ?? '',
            movementType: exercise?.movementType ?? '',
            videoUrl: exercise?.videoUrl ?? null,
            rangeOfMotionDegrees: series.rangeOfMotionDegrees,
            repetitions: series.repetitions,
            durationSeconds: series.durationSeconds,
            restDurationSeconds: series.restDurationSeconds,
          };
        }),
    };
  }

  private buildCreateCommand(): CreateTreatmentPlanCommand {
    const value = this.form.getRawValue();
    const routines = this.normalizedRoutinesForPersistence();
    return new CreateTreatmentPlanCommand({
      name: value.name,
      period: {
        startsAt: value.startsAt,
        endsAt: value.endsAt,
      },
      routines: routines.map((routine) => ({
        name: routine.name,
        order: routine.order,
        schedule: {
          dayOfWeek: routine.scheduleDayOfWeek,
          scheduledTime: routine.scheduleTime,
        },
        exerciseSeries: routine.exerciseSeries
          .slice()
          .sort((left, right) => left.order - right.order)
          .map((series) => ({
            order: series.order,
            exerciseId: series.exerciseId,
            rangeOfMotionDegrees: Number(series.rangeOfMotionDegrees),
            repetitions: Number(series.repetitions),
            durationSeconds: Number(series.durationSeconds),
            restDurationSeconds: Number(series.restDurationSeconds),
          })),
      })),
    });
  }

  private buildUpdateCommand(): UpdateTreatmentPlanCommand {
    const value = this.form.getRawValue();
    return new UpdateTreatmentPlanCommand({
      name: value.name,
      period: {
        startsAt: value.startsAt,
        endsAt: value.endsAt,
      },
    });
  }

  private async persistWorkspace(patientId: string): Promise<void> {
    this.savingSignal.set(true);
    try {
      if (this.isCreateMode()) {
        const created = await this.planningStore.createTreatmentPlan(
          patientId,
          this.buildCreateCommand(),
        );
        await this.planningStore.loadTreatmentPlansByPatient(patientId);
        await this.router.navigate([
          '/physiotherapist/patients',
          patientId,
          'treatment-plans',
          created.id,
        ]);
        this.notifySuccess(
          'treatmentPlanWorkspace.notifications.createSuccessSummary',
          'treatmentPlanWorkspace.notifications.createSuccessDetail',
        );
        return;
      }

      const originalPlan = this.originalPlanSignal();
      if (!originalPlan) return;

      await this.planningStore.updateTreatmentPlan(originalPlan.id, this.buildUpdateCommand());
      await this.syncRoutineChanges(originalPlan);
      await this.afterPlanMutation(patientId, originalPlan.id);
      this.notifySuccess(
        'treatmentPlanWorkspace.notifications.saveSuccessSummary',
        'treatmentPlanWorkspace.notifications.saveSuccessDetail',
      );
    } catch (error) {
      this.notifyError(
        'treatmentPlanWorkspace.notifications.saveErrorSummary',
        'treatmentPlanWorkspace.notifications.saveErrorDetail',
      );
    } finally {
      this.savingSignal.set(false);
    }
  }

  private async syncRoutineChanges(originalPlan: TreatmentPlan): Promise<void> {
    const currentRoutines = this.normalizedRoutinesForPersistence();
    const originalById = new Map(
      originalPlan.routines
        .filter((routine) => !!routine.id)
        .map((routine) => [routine.id, routine] as const),
    );

    for (const routine of currentRoutines) {
      if (!routine.backendId) continue;
      const originalRoutine = originalById.get(routine.backendId);
      if (!originalRoutine) continue;

      if (!this.hasRoutineChanged(routine, originalRoutine)) continue;

      await this.planningStore.updateRoutine(
        originalPlan.id,
        originalRoutine.order,
        new UpdateRoutineCommand({
          name: routine.name,
          newOrder: routine.order,
          schedule: {
            dayOfWeek: routine.scheduleDayOfWeek,
            scheduledTime: routine.scheduleTime,
          },
          exerciseSeries: routine.exerciseSeries
            .slice()
            .sort((left, right) => left.order - right.order)
            .map((series) => ({
              order: series.order,
              exerciseId: series.exerciseId,
              rangeOfMotionDegrees: Number(series.rangeOfMotionDegrees),
              repetitions: Number(series.repetitions),
              durationSeconds: Number(series.durationSeconds),
              restDurationSeconds: Number(series.restDurationSeconds),
            })),
        }),
      );
    }

    const currentBackendIds = new Set(
      currentRoutines.filter((routine) => !!routine.backendId).map((routine) => routine.backendId),
    );
    const deletedRoutines = originalPlan.routines
      .filter((routine) => routine.id && !currentBackendIds.has(routine.id))
      .sort((left, right) => right.order - left.order);

    for (const routine of deletedRoutines) {
      await this.planningStore.deleteRoutine(originalPlan.id, routine.order);
    }

    const newRoutines = currentRoutines.filter((routine) => !routine.backendId);
    for (const routine of newRoutines) {
      await this.planningStore.addRoutine(
        originalPlan.id,
        new AddRoutineCommand({
          name: routine.name,
          order: routine.order,
          schedule: {
            dayOfWeek: routine.scheduleDayOfWeek,
            scheduledTime: routine.scheduleTime,
          },
          exerciseSeries: routine.exerciseSeries
            .slice()
            .sort((left, right) => left.order - right.order)
            .map((series) => ({
              order: series.order,
              exerciseId: series.exerciseId,
              rangeOfMotionDegrees: Number(series.rangeOfMotionDegrees),
              repetitions: Number(series.repetitions),
              durationSeconds: Number(series.durationSeconds),
              restDurationSeconds: Number(series.restDurationSeconds),
            })),
        }),
      );
    }
  }

  private hasRoutineChanged(routine: RoutineDraft, originalRoutine: TreatmentPlanRoutine): boolean {
    if (routine.name !== originalRoutine.name) return true;
    if (routine.order !== originalRoutine.order) return true;
    if (routine.scheduleDayOfWeek !== originalRoutine.schedule.dayOfWeek) return true;
    if (routine.scheduleTime !== originalRoutine.schedule.scheduledTime) return true;
    if (routine.exerciseSeries.length !== originalRoutine.exerciseSeries.length) return true;

    const originalSeries = originalRoutine.exerciseSeries
      .slice()
      .sort((left, right) => left.order - right.order);
    const currentSeries = routine.exerciseSeries
      .slice()
      .sort((left, right) => left.order - right.order);

    return currentSeries.some((series, index) => {
      const original = originalSeries[index];
      if (!original) return true;
      return (
        series.order !== original.order ||
        series.exerciseId !== original.exerciseId ||
        Number(series.rangeOfMotionDegrees) !== original.rangeOfMotionDegrees ||
        Number(series.repetitions) !== original.repetitions ||
        Number(series.durationSeconds) !== original.durationSeconds ||
        Number(series.restDurationSeconds) !== original.restDurationSeconds
      );
    });
  }

  private resequenceRoutines(routines: RoutineDraft[]): RoutineDraft[] {
    return routines
      .slice()
      .sort((left, right) => left.order - right.order)
      .map((routine, index) => ({
        ...routine,
        order: index + 1,
      }));
  }

  private nextRoutineOrder(): number {
    if (this.routines().length === 0) return 1;
    return Math.max(...this.routines().map((routine) => routine.order)) + 1;
  }

  private normalizedRoutinesForPersistence(): RoutineDraft[] {
    return this.resequenceRoutines(this.routines()).map((routine) => ({
      ...routine,
      exerciseSeries: routine.exerciseSeries
        .slice()
        .sort((left, right) => left.order - right.order)
        .map((series, index) => ({
          ...series,
          order: index + 1,
        })),
    }));
  }

  private async runTransition(action: () => Promise<void>): Promise<void> {
    this.runningTransitionSignal.set(true);
    try {
      await action();
    } catch (error) {
      this.notifyError(
        'treatmentPlanWorkspace.notifications.actionErrorSummary',
        'treatmentPlanWorkspace.notifications.actionErrorDetail',
      );
    } finally {
      this.runningTransitionSignal.set(false);
    }
  }

  private async afterPlanMutation(patientId: string, planId: string): Promise<void> {
    await this.planningStore.loadTreatmentPlansByPatient(patientId);
    const refreshed = await this.planningStore.loadTreatmentPlan(patientId, planId);
    this.originalPlanSignal.set(refreshed);
    this.patchDraftFromPlan(refreshed);
  }

  private notifySuccess(summaryKey: string, detailKey: string) {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant(summaryKey),
      detail: this.translate.instant(detailKey, {
        patient: this.patient()?.fullName ?? '',
      }),
      life: 4000,
    });
  }

  private notifyError(summaryKey: string, detailKey: string) {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant(summaryKey),
      detail: this.translate.instant(detailKey),
      life: 4500,
    });
  }
}
