import {Injectable, computed, signal} from '@angular/core';
import {ClinicalAlert} from '../domain/model/clinical-alert.entity';
import {ClinicalMetrics} from '../domain/model/clinical-metrics';
import {ClinicalTrajectory} from '../domain/model/clinical-trajectory';
import {Patient} from '../domain/model/patient.entity';
import {RehabProgram} from '../domain/model/rehab-program.entity';
import {RoutineExercise} from '../domain/model/routine-exercise.entity';
import {Session} from '../domain/model/session.entity';
import {MOCK_CLINICAL_ALERTS} from '../infrastructure/clinical-alert.mock';
import {MOCK_CLINICAL_METRICS} from '../infrastructure/clinical-metrics.mock';
import {MOCK_CLINICAL_TRAJECTORY} from '../infrastructure/clinical-trajectory.mock';
import {MOCK_PATIENTS} from '../infrastructure/patient.mock';
import {MOCK_REHAB_PROGRAM} from '../infrastructure/rehab-program.mock';
import {MOCK_DAILY_SESSIONS} from '../infrastructure/session.mock';

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

  readonly patients = this.patientsSignal.asReadonly();
  readonly dailySessions = this.dailySessionsSignal.asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly metrics = this.metricsSignal.asReadonly();
  readonly rehabProgram = this.rehabProgramSignal.asReadonly();
  readonly trajectory = this.trajectorySignal.asReadonly();

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
}
