import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DEMO_CLINIC_ID, DEMO_PHYSIOTHERAPIST_ID } from './demo.constants';
import {
  computeDemoFleetMetrics,
  createDemoDevices,
  createDemoPatients,
  createDemoSessionHistory,
  createDemoTherapyOverview,
  createDemoTreatmentPlans,
  DEMO_CLINIC,
  DEMO_EXERCISES,
  DEMO_PHYSIOTHERAPIST,
} from './demo-seed-data';
import {
  DemoDailySchedule,
  DemoDevice,
  DemoExercise,
  DemoPatient,
  DemoSerieProgress,
  DemoSessionHistoryItem,
  DemoSessionProgress,
  DemoSessionSummary,
  DemoTherapyOverview,
  DemoTherapySession,
  DemoTherapySessionDetail,
  DemoTreatmentPlan,
} from './demo.types';
import {
  RoutineSchedule as DemoRoutineSchedule,
  ExerciseSeriesItem as DemoExerciseSeriesItem,
  TreatmentPlanPeriod as DemoTreatmentPlanPeriod,
} from '../../../planning/domain/model/treatment-plan.types';
import {
  ExerciseBodyPart,
  ExerciseMovementType,
} from '../../../planning/domain/model/exercise-catalog-item.types';
import {
  CompletedRepetitionResource,
  SerieExecutionResource,
} from '../../../therapy/infrastructure/therapy-session.response';

function notFound(): never {
  throw new HttpErrorResponse({
    status: 404,
    statusText: 'Not Found',
    error: { message: 'Not found' },
  });
}

interface AddRoutineBody {
  name: string;
  order: number;
  schedule: DemoRoutineSchedule;
  exerciseSeries: DemoExerciseSeriesItem[];
}

interface UpdateRoutineBody {
  name: string;
  newOrder: number;
  schedule: DemoRoutineSchedule;
  exerciseSeries: DemoExerciseSeriesItem[];
}

/**
 * In-memory fake backend for the client-only "Ver demo" flow — no HTTP, no server.
 * Re-created fresh (fresh seed) on every full page load, since it is `providedIn: 'root'`.
 */
@Injectable({ providedIn: 'root' })
export class DemoDatabase {
  private patients: DemoPatient[] = createDemoPatients();
  private treatmentPlans: DemoTreatmentPlan[] = createDemoTreatmentPlans();
  private devices: DemoDevice[] = createDemoDevices();
  private readonly exercises: DemoExercise[] = DEMO_EXERCISES;
  private readonly therapyOverview: DemoTherapyOverview[] = createDemoTherapyOverview();
  private readonly sessionHistory: Record<string, DemoSessionHistoryItem[]> =
    createDemoSessionHistory();

  private activeSession: DemoTherapySession | null = {
    id: 'demo-session-1',
    patientId: 'demo-patient-1',
    treatmentPlanId: 'demo-plan-1',
    iotDeviceId: 'demo-device-1',
    sensorsPlaced: true,
    status: 'InProgress',
    painLevel: 1,
    requiresClinicalReview: false,
    startedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    finalizedAt: null,
  };

  private readonly progressBySessionId: Record<string, DemoSessionProgress> = {
    'demo-session-1': {
      sessionId: 'demo-session-1',
      status: 'InProgress',
      currentSerieId: 'demo-serie-1',
      completedSeries: 0,
      totalSeries: 2,
      painLevel: 1,
      requiresClinicalReview: false,
      seriesProgress: [
        {
          serieId: 'demo-serie-1',
          exerciseId: 'demo-exercise-1',
          currentRepetitions: 0,
          targetRepetitions: 10,
          status: 'Started',
        },
        {
          serieId: 'demo-serie-2',
          exerciseId: 'demo-exercise-2',
          currentRepetitions: 0,
          targetRepetitions: 8,
          status: 'Pending',
        },
      ],
    },
  };

  // --- Organization -------------------------------------------------------

  getCurrentClinic() {
    return DEMO_CLINIC;
  }

  getCurrentPhysiotherapist() {
    return DEMO_PHYSIOTHERAPIST;
  }

  getMyPatients(): DemoPatient[] {
    return this.patients.filter((p) => p.assignedPhysiotherapistId === DEMO_PHYSIOTHERAPIST_ID);
  }

  getPatientById(id: string): DemoPatient {
    return this.patients.find((p) => p.id === id) ?? notFound();
  }

  registerPatient(body: Partial<DemoPatient>): DemoPatient {
    const patient: DemoPatient = {
      id: crypto.randomUUID(),
      firstName: body.firstName ?? '',
      lastName: body.lastName ?? '',
      dni: body.dni ?? '',
      birthDate: body.birthDate ?? '',
      gender: body.gender ?? 'OTHER',
      email: body.email ?? '',
      countryCode: body.countryCode ?? '',
      phoneNumber: body.phoneNumber ?? '',
      medicalCondition: body.medicalCondition ?? '',
      assignedPhysiotherapistId: DEMO_PHYSIOTHERAPIST_ID,
      status: 'REGISTERED',
      clinicId: DEMO_CLINIC_ID,
    };
    this.patients = [patient, ...this.patients];
    return patient;
  }

  updatePatientContact(
    id: string,
    body: Pick<
      DemoPatient,
      'firstName' | 'lastName' | 'email' | 'countryCode' | 'phoneNumber' | 'medicalCondition'
    >,
  ): DemoPatient {
    const patient = this.getPatientById(id);
    Object.assign(patient, body);
    return patient;
  }

  dischargePatient(id: string): void {
    this.getPatientById(id).status = 'DISCHARGED';
  }

  deletePatient(id: string): void {
    this.getPatientById(id);
    this.patients = this.patients.filter((p) => p.id !== id);
  }

  // --- Planning: exercises --------------------------------------------------

  listExercises(): DemoExercise[] {
    return this.exercises;
  }

  getExerciseById(id: string): DemoExercise {
    return this.exercises.find((e) => e.id === id) ?? notFound();
  }

  // --- Planning: treatment plans ---------------------------------------------

  getAllTreatmentPlans(filters: {
    patientId?: string;
    physiotherapistId?: string;
    status?: string;
  }): DemoTreatmentPlan[] {
    return this.treatmentPlans.filter((plan) => {
      if (filters.patientId && plan.patientId !== filters.patientId) return false;
      if (filters.status && plan.status !== filters.status) return false;
      return true;
    });
  }

  getTreatmentPlansByPatient(patientId: string): DemoTreatmentPlan[] {
    return this.treatmentPlans.filter((plan) => plan.patientId === patientId);
  }

  getTreatmentPlan(patientId: string, planId: string): DemoTreatmentPlan {
    return (
      this.treatmentPlans.find((p) => p.id === planId && p.patientId === patientId) ?? notFound()
    );
  }

  getTreatmentPlanById(id: string): DemoTreatmentPlan {
    return this.treatmentPlans.find((p) => p.id === id) ?? notFound();
  }

  createTreatmentPlan(
    patientId: string,
    body: { name: string; period: DemoTreatmentPlanPeriod; routines: AddRoutineBody[] },
  ): DemoTreatmentPlan {
    const plan: DemoTreatmentPlan = {
      id: crypto.randomUUID(),
      patientId,
      name: body.name,
      status: 'SCHEDULED',
      period: body.period,
      routines: (body.routines ?? []).map((routine) => ({
        id: crypto.randomUUID(),
        name: routine.name,
        order: routine.order,
        schedule: routine.schedule,
        exerciseSeries: routine.exerciseSeries,
      })),
    };
    this.treatmentPlans = [plan, ...this.treatmentPlans];
    return plan;
  }

  updateTreatmentPlan(
    id: string,
    body: { name: string; period: DemoTreatmentPlanPeriod },
  ): DemoTreatmentPlan {
    const plan = this.getTreatmentPlanById(id);
    plan.name = body.name;
    plan.period = body.period;
    return plan;
  }

  activateTreatmentPlan(id: string): DemoTreatmentPlan {
    const plan = this.getTreatmentPlanById(id);
    plan.status = 'ACTIVE';
    return plan;
  }

  completeTreatmentPlan(id: string): DemoTreatmentPlan {
    const plan = this.getTreatmentPlanById(id);
    plan.status = 'COMPLETED';
    return plan;
  }

  cancelTreatmentPlan(id: string): DemoTreatmentPlan {
    const plan = this.getTreatmentPlanById(id);
    plan.status = 'CANCELED';
    return plan;
  }

  deleteTreatmentPlan(id: string): void {
    this.getTreatmentPlanById(id);
    this.treatmentPlans = this.treatmentPlans.filter((p) => p.id !== id);
  }

  addRoutine(planId: string, body: AddRoutineBody): DemoTreatmentPlan {
    const plan = this.getTreatmentPlanById(planId);
    plan.routines = [
      ...plan.routines,
      {
        id: crypto.randomUUID(),
        name: body.name,
        order: body.order,
        schedule: body.schedule,
        exerciseSeries: body.exerciseSeries,
      },
    ];
    return plan;
  }

  updateRoutine(planId: string, order: number, body: UpdateRoutineBody): DemoTreatmentPlan {
    const plan = this.getTreatmentPlanById(planId);
    const routine = plan.routines.find((r) => r.order === order) ?? notFound();
    routine.name = body.name;
    routine.order = body.newOrder;
    routine.schedule = body.schedule;
    routine.exerciseSeries = body.exerciseSeries;
    return plan;
  }

  deleteRoutine(planId: string, order: number): DemoTreatmentPlan {
    const plan = this.getTreatmentPlanById(planId);
    if (!plan.routines.some((r) => r.order === order)) notFound();
    plan.routines = plan.routines.filter((r) => r.order !== order);
    return plan;
  }

  // --- Therapy --------------------------------------------------------------

  getOverview(): DemoTherapyOverview[] {
    return this.therapyOverview;
  }

  getActiveSession(patientId: string): DemoTherapySession {
    if (this.activeSession?.patientId === patientId && this.activeSession.status === 'InProgress') {
      return this.activeSession;
    }
    return notFound();
  }

  getSchedule(patientId: string, date?: string): DemoDailySchedule {
    const plan = this.treatmentPlans.find(
      (p) => p.patientId === patientId && p.status === 'ACTIVE',
    );
    const routine = plan?.routines[0];
    if (!plan || !routine) {
      return {
        patientId,
        date: date ?? new Date().toISOString().slice(0, 10),
        resolutionStatus: 'NO_ACTIVE_PLAN_FOR_DATE',
        routineId: null,
        totalSeries: null,
        estimatedDurationMinutes: null,
      };
    }
    return {
      patientId,
      date: date ?? new Date().toISOString().slice(0, 10),
      resolutionStatus: 'FOUND',
      routineId: routine.id,
      totalSeries: routine.exerciseSeries.length,
      estimatedDurationMinutes: routine.exerciseSeries.length * 4,
    };
  }

  /**
   * Advances the seeded active session's progress by a small, bounded amount on every call —
   * this is what makes `TherapyTracking` feel alive under the ~3s polling of `TherapyLive`
   * without any change to that polling code.
   */
  getProgress(sessionId: string): DemoSessionProgress {
    const progress = this.progressBySessionId[sessionId];
    if (!progress) return notFound();

    const currentIndex = progress.seriesProgress.findIndex(
      (s) => s.serieId === progress.currentSerieId,
    );
    if (currentIndex === -1) return progress;

    const current: DemoSerieProgress = progress.seriesProgress[currentIndex];
    const target = current.targetRepetitions ?? 0;
    if ((current.currentRepetitions ?? 0) < target) {
      current.currentRepetitions = Math.min((current.currentRepetitions ?? 0) + 1, target);
    }

    if ((current.currentRepetitions ?? 0) >= target) {
      current.status = 'Completed';
      progress.completedSeries = (progress.completedSeries ?? 0) + 1;
      const next = progress.seriesProgress[currentIndex + 1];
      if (next) {
        progress.currentSerieId = next.serieId;
        next.status = 'Started';
      } else {
        progress.currentSerieId = null;
        progress.status = 'Completed';
        if (this.activeSession?.id === sessionId) {
          this.activeSession.status = 'Completed';
          this.activeSession.finalizedAt = new Date().toISOString();
        }
      }
    }

    return progress;
  }

  getSummary(sessionId: string): DemoSessionSummary {
    if (sessionId === 'demo-session-1' && this.progressBySessionId[sessionId]) {
      const progress = this.progressBySessionId[sessionId];
      const totalRepetitions = progress.seriesProgress.reduce(
        (sum, s) => sum + (s.currentRepetitions ?? 0),
        0,
      );
      const goodRepetitions = Math.round(totalRepetitions * 0.9);
      return {
        sessionId,
        patientId: this.activeSession?.patientId ?? 'demo-patient-1',
        totalSeries: progress.totalSeries,
        completedSeries: progress.completedSeries,
        totalRepetitions,
        goodRepetitions,
        incompleteRepetitions: Math.max(totalRepetitions - goodRepetitions, 0),
        unsafeRepetitions: 0,
        averageAchievedRom: 75,
        painLevel: progress.painLevel,
        painReportsCount: 1,
        highPainReportsCount: 0,
        maxReportedPainLevel: progress.painLevel,
        requiresClinicalReview: progress.requiresClinicalReview,
        compensatoryMovementsDetected: 0,
        startedAt: this.activeSession?.startedAt ?? null,
        finalizedAt: this.activeSession?.finalizedAt ?? null,
      };
    }

    const found = this.findHistoryEntry(sessionId);
    if (!found) return notFound();
    const { patientId, item } = found;
    return {
      sessionId: item.sessionId,
      patientId,
      totalSeries: item.totalSeries,
      completedSeries: item.completedSeries,
      totalRepetitions: item.totalRepetitions,
      goodRepetitions: item.goodRepetitions,
      incompleteRepetitions: item.incompleteRepetitions,
      unsafeRepetitions: item.unsafeRepetitions,
      averageAchievedRom: item.averageAchievedRom,
      painLevel: item.painLevel,
      painReportsCount: (item.painLevel ?? 0) > 0 ? 1 : 0,
      highPainReportsCount: (item.maxReportedPainLevel ?? 0) >= 5 ? 1 : 0,
      maxReportedPainLevel: item.maxReportedPainLevel,
      requiresClinicalReview: item.requiresClinicalReview,
      compensatoryMovementsDetected: item.compensatoryMovementsDetected,
      startedAt: item.startedAt,
      finalizedAt: item.finalizedAt,
    };
  }

  getDetail(sessionId: string): DemoTherapySessionDetail {
    if (sessionId === 'demo-session-1' && this.progressBySessionId[sessionId]) {
      const progress = this.progressBySessionId[sessionId];
      const repsDoneByExerciseId = new Map(
        progress.seriesProgress.map((s) => [s.exerciseId, s.currentRepetitions ?? 0]),
      );
      const routine = this.findRoutine('demo-plan-1', 'demo-routine-1');
      const series = this.buildSeries(
        routine,
        (exerciseId) => repsDoneByExerciseId.get(exerciseId) ?? 0,
        0.9,
        sessionId,
      );
      const totalRepetitions = progress.seriesProgress.reduce(
        (s, x) => s + (x.currentRepetitions ?? 0),
        0,
      );
      const goodRepetitions = Math.round(totalRepetitions * 0.9);
      return {
        sessionId,
        patientId: this.activeSession?.patientId ?? 'demo-patient-1',
        treatmentPlanId: this.activeSession?.treatmentPlanId ?? null,
        planningRoutineId: 'demo-routine-1',
        iotDeviceId: this.activeSession?.iotDeviceId ?? null,
        status: progress.status,
        sensorsPlaced: this.activeSession?.sensorsPlaced ?? null,
        startedAt: this.activeSession?.startedAt ?? null,
        finalizedAt: this.activeSession?.finalizedAt ?? null,
        cancellationReason: null,
        totalSeries: progress.totalSeries,
        completedSeries: progress.completedSeries,
        totalRepetitions,
        goodRepetitions,
        incompleteRepetitions: Math.max(totalRepetitions - goodRepetitions, 0),
        unsafeRepetitions: 0,
        averageAchievedRom: 75,
        painLevel: progress.painLevel,
        painReportsCount: 1,
        highPainReportsCount: 0,
        maxReportedPainLevel: progress.painLevel,
        requiresClinicalReview: progress.requiresClinicalReview,
        compensatoryMovementsDetected: 0,
        series,
        compensatoryMovements: [],
      };
    }

    const found = this.findHistoryEntry(sessionId);
    if (!found) return notFound();
    const { patientId, item } = found;
    const routine = this.findRoutine(item.treatmentPlanId, item.planningRoutineId);
    const goodShare =
      item.totalRepetitions && item.totalRepetitions > 0
        ? (item.goodRepetitions ?? 0) / item.totalRepetitions
        : 1;
    const series = this.buildSeries(routine, (_, target) => target, goodShare, item.sessionId);
    return {
      sessionId: item.sessionId,
      patientId,
      treatmentPlanId: item.treatmentPlanId,
      planningRoutineId: item.planningRoutineId,
      iotDeviceId: null,
      status: item.status,
      sensorsPlaced: true,
      startedAt: item.startedAt,
      finalizedAt: item.finalizedAt,
      cancellationReason: null,
      totalSeries: item.totalSeries,
      completedSeries: item.completedSeries,
      totalRepetitions: item.totalRepetitions,
      goodRepetitions: item.goodRepetitions,
      incompleteRepetitions: item.incompleteRepetitions,
      unsafeRepetitions: item.unsafeRepetitions,
      averageAchievedRom: item.averageAchievedRom,
      painLevel: item.painLevel,
      painReportsCount: (item.painLevel ?? 0) > 0 ? 1 : 0,
      highPainReportsCount: (item.maxReportedPainLevel ?? 0) >= 5 ? 1 : 0,
      maxReportedPainLevel: item.maxReportedPainLevel,
      requiresClinicalReview: item.requiresClinicalReview,
      compensatoryMovementsDetected: item.compensatoryMovementsDetected,
      series,
      compensatoryMovements: [],
    };
  }

  private findHistoryEntry(
    sessionId: string,
  ): { patientId: string; item: DemoSessionHistoryItem } | null {
    for (const [patientId, items] of Object.entries(this.sessionHistory)) {
      const item = items.find((i) => i.sessionId === sessionId);
      if (item) return { patientId, item };
    }
    return null;
  }

  private findRoutine(
    treatmentPlanId: string | null,
    routineId: string | null,
  ): DemoTreatmentPlan['routines'][number] | undefined {
    const plan = treatmentPlanId
      ? this.treatmentPlans.find((p) => p.id === treatmentPlanId)
      : undefined;
    return plan?.routines.find((r) => r.id === routineId) ?? plan?.routines[0];
  }

  /** `repsForExercise` lets the live (partial) and history (fully completed) sessions share this. */
  private buildSeries(
    routine: DemoTreatmentPlan['routines'][number] | undefined,
    repsForExercise: (exerciseId: string, target: number) => number,
    goodShare: number,
    sessionId: string,
  ): SerieExecutionResource[] {
    if (!routine) return [];
    return routine.exerciseSeries.map((series) => {
      const exercise = this.exercises.find((e) => e.id === series.exerciseId);
      const repsDone = repsForExercise(series.exerciseId, series.repetitions);
      const goodCount = Math.round(repsDone * goodShare);
      return {
        serieId: `${sessionId}-serie-${series.order}`,
        exerciseId: series.exerciseId,
        targetRepetitions: series.repetitions,
        targetRom: series.rangeOfMotionDegrees,
        movementType: (exercise?.movementType as ExerciseMovementType | undefined) ?? null,
        bodyPart: (exercise?.bodyPart as ExerciseBodyPart | undefined) ?? null,
        durationSeconds: series.durationSeconds,
        restDurationSeconds: series.restDurationSeconds,
        status: repsDone >= series.repetitions ? 'Completed' : repsDone > 0 ? 'Started' : 'Pending',
        repetitions: this.synthesizeRepetitions(
          repsDone,
          goodCount,
          series.rangeOfMotionDegrees,
          sessionId,
          series.order,
        ),
      };
    });
  }

  /** Deterministic per-rep jitter so the ROM chart shows a believable shape, not a flat line. */
  private synthesizeRepetitions(
    count: number,
    goodCount: number,
    targetRom: number,
    sessionId: string,
    serieOrder: number,
  ): CompletedRepetitionResource[] {
    return Array.from({ length: count }, (_, i) => {
      const isGood = i < goodCount;
      const jitter = Math.round(Math.sin((i + 1) * 1.7 + serieOrder) * 3);
      const achievedRom = isGood
        ? targetRom + Math.abs(jitter)
        : Math.max(targetRom - 8 - Math.abs(jitter), 0);
      return {
        repetitionId: `${sessionId}-serie-${serieOrder}-rep-${i + 1}`,
        peakAngle: achievedRom,
        achievedRom,
        classification: isGood ? 'Good' : 'Incomplete',
        recordedAt: null,
      };
    });
  }

  getHistoryByPatient(patientId: string, treatmentPlanId?: string): DemoSessionHistoryItem[] {
    const history = this.sessionHistory[patientId] ?? [];
    return treatmentPlanId ? history.filter((h) => h.treatmentPlanId === treatmentPlanId) : history;
  }

  // --- Device -----------------------------------------------------------------

  listDevices(): DemoDevice[] {
    return this.devices;
  }

  getFleetMetrics() {
    return computeDemoFleetMetrics(this.devices);
  }

  getDeviceById(id: string): DemoDevice {
    return this.devices.find((d) => d.id === id) ?? notFound();
  }

  getDeviceBySerialNumber(serialNumber: string): DemoDevice {
    return this.devices.find((d) => d.serialNumber === serialNumber) ?? notFound();
  }

  getMyAssignedDevice(): DemoDevice {
    return this.devices.find((d) => d.currentPatientId != null) ?? notFound();
  }

  deleteDevice(id: string): void {
    this.getDeviceById(id);
    this.devices = this.devices.filter((d) => d.id !== id);
  }

  updateDeviceStatus(id: string, status: DemoDevice['status']): DemoDevice {
    const device = this.getDeviceById(id);
    device.status = status;
    return device;
  }

  updateDeviceCalibration(id: string, action: 'needs_calibration' | 'validate'): DemoDevice {
    const device = this.getDeviceById(id);
    device.calibrationStatus = action === 'validate' ? 'VALID' : 'NEEDS_CALIBRATION';
    return device;
  }

  updateDeviceTelemetry(id: string, batteryLevel: number): DemoDevice {
    const device = this.getDeviceById(id);
    device.batteryLevel = batteryLevel;
    device.lastSeenAt = new Date().toISOString();
    return device;
  }

  assignDeviceToPatient(deviceId: string, patientId: string): DemoDevice {
    const device = this.getDeviceById(deviceId);
    const patient = this.getPatientById(patientId);
    device.currentPatientId = patient.id;
    device.currentPatientFullName = `${patient.firstName} ${patient.lastName}`;
    device.status = 'ASSIGNED';
    return device;
  }

  unassignDevice(deviceId: string): DemoDevice {
    const device = this.getDeviceById(deviceId);
    device.currentPatientId = null;
    device.currentPatientFullName = null;
    device.status = 'AVAILABLE';
    return device;
  }
}
