import {
  ExerciseBodyPart,
  ExerciseMovementType,
} from '../../planning/domain/model/exercise-catalog-item.types';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import {
  CompensatoryMovementType,
  DailyScheduleResolutionStatus,
  RepetitionClassification,
  TherapySerieStatus,
  TherapySessionStatus,
} from '../domain/model/therapy-session.types';

export interface TherapySessionResource {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  iotDeviceId: string;
  sensorsPlaced: boolean | null;
  status: TherapySessionStatus | null;
  painLevel: number | null;
  requiresClinicalReview: boolean | null;
  startedAt: string | null;
  finalizedAt: string | null;
}

export interface TherapySessionResponse extends BaseResponse {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  iotDeviceId: string;
  sensorsPlaced: boolean | null;
  status: TherapySessionStatus | null;
  painLevel: number | null;
  requiresClinicalReview: boolean | null;
  startedAt: string | null;
  finalizedAt: string | null;
}

export interface SessionSummaryResource {
  sessionId: string;
  patientId: string;
  totalSeries: number | null;
  completedSeries: number | null;
  totalRepetitions: number | null;
  goodRepetitions: number | null;
  incompleteRepetitions: number | null;
  unsafeRepetitions: number | null;
  averageAchievedRom: number | null;
  painLevel: number | null;
  painReportsCount: number | null;
  highPainReportsCount: number | null;
  maxReportedPainLevel: number | null;
  requiresClinicalReview: boolean | null;
  compensatoryMovementsDetected: number | null;
  startedAt: string | null;
  finalizedAt: string | null;
}

export interface SessionSummaryResponse extends BaseResponse {
  sessionId: string;
  patientId: string;
  totalSeries: number | null;
  completedSeries: number | null;
  totalRepetitions: number | null;
  goodRepetitions: number | null;
  incompleteRepetitions: number | null;
  unsafeRepetitions: number | null;
  averageAchievedRom: number | null;
  painLevel: number | null;
  painReportsCount: number | null;
  highPainReportsCount: number | null;
  maxReportedPainLevel: number | null;
  requiresClinicalReview: boolean | null;
  compensatoryMovementsDetected: number | null;
  startedAt: string | null;
  finalizedAt: string | null;
}

/** One row of a patient's session history, aggregates already computed by the backend. */
export interface TherapySessionHistoryItemResource {
  sessionId: string;
  status: TherapySessionStatus | null;
  /** Null for a session cancelled before it ever started. */
  startedAt: string | null;
  finalizedAt: string | null;
  treatmentPlanId: string | null;
  planningRoutineId: string | null;
  totalSeries: number | null;
  completedSeries: number | null;
  totalRepetitions: number | null;
  goodRepetitions: number | null;
  incompleteRepetitions: number | null;
  unsafeRepetitions: number | null;
  /** Null when the session recorded no repetitions. */
  averageAchievedRom: number | null;
  painLevel: number | null;
  maxReportedPainLevel: number | null;
  requiresClinicalReview: boolean | null;
  compensatoryMovementsDetected: number | null;
}

export interface TherapySessionHistoryItemResponse extends BaseResponse {
  sessionId: string;
  status: TherapySessionStatus | null;
  startedAt: string | null;
  finalizedAt: string | null;
  treatmentPlanId: string | null;
  planningRoutineId: string | null;
  totalSeries: number | null;
  completedSeries: number | null;
  totalRepetitions: number | null;
  goodRepetitions: number | null;
  incompleteRepetitions: number | null;
  unsafeRepetitions: number | null;
  averageAchievedRom: number | null;
  painLevel: number | null;
  maxReportedPainLevel: number | null;
  requiresClinicalReview: boolean | null;
  compensatoryMovementsDetected: number | null;
}

/** One repetition as detected by the edge. */
export interface CompletedRepetitionResource {
  repetitionId: string;
  /** Peak joint angle reached, in degrees. */
  peakAngle: number | null;
  /** Peak minus the baseline discovered for that repetition. */
  achievedRom: number | null;
  classification: RepetitionClassification | null;
  /** Edge wall clock with no zone — do not put it on the same axis as the session's Instants. */
  recordedAt: string | null;
}

export interface CompletedRepetitionResponse extends BaseResponse {
  repetitionId: string;
  peakAngle: number | null;
  achievedRom: number | null;
  classification: RepetitionClassification | null;
  recordedAt: string | null;
}

export interface CompensatoryMovementResource {
  movementId: string;
  type: CompensatoryMovementType | null;
  detectedAt: string | null;
}

export interface CompensatoryMovementResponse extends BaseResponse {
  movementId: string;
  type: CompensatoryMovementType | null;
  detectedAt: string | null;
}

/** A serie together with the repetitions actually recorded against it. */
export interface SerieExecutionResource {
  serieId: string;
  exerciseId: string | null;
  targetRepetitions: number | null;
  targetRom: number | null;
  movementType: ExerciseMovementType | null;
  bodyPart: ExerciseBodyPart | null;
  /** Prescribed, not measured: a serie carries no start/end timestamps. */
  durationSeconds: number | null;
  restDurationSeconds: number | null;
  status: TherapySerieStatus | null;
  repetitions: CompletedRepetitionResource[];
}

export interface SerieExecutionResponse extends BaseResponse {
  serieId: string;
  exerciseId: string | null;
  targetRepetitions: number | null;
  targetRom: number | null;
  movementType: ExerciseMovementType | null;
  bodyPart: ExerciseBodyPart | null;
  durationSeconds: number | null;
  restDurationSeconds: number | null;
  status: TherapySerieStatus | null;
  repetitions: CompletedRepetitionResponse[] | null;
}

/**
 * Full inspection view of a session. Unlike {@link SessionSummaryResource}, it resolves in any
 * status, so it also backs the drill-down into a session that is still running.
 */
export interface TherapySessionDetailResource {
  sessionId: string;
  patientId: string;
  treatmentPlanId: string | null;
  planningRoutineId: string | null;
  iotDeviceId: string | null;
  status: TherapySessionStatus | null;
  sensorsPlaced: boolean | null;
  startedAt: string | null;
  finalizedAt: string | null;
  cancellationReason: string | null;
  totalSeries: number | null;
  completedSeries: number | null;
  totalRepetitions: number | null;
  goodRepetitions: number | null;
  incompleteRepetitions: number | null;
  unsafeRepetitions: number | null;
  averageAchievedRom: number | null;
  painLevel: number | null;
  painReportsCount: number | null;
  highPainReportsCount: number | null;
  maxReportedPainLevel: number | null;
  requiresClinicalReview: boolean | null;
  compensatoryMovementsDetected: number | null;
  series: SerieExecutionResource[];
  compensatoryMovements: CompensatoryMovementResource[];
}

export interface TherapySessionDetailResponse extends BaseResponse {
  sessionId: string;
  patientId: string;
  treatmentPlanId: string | null;
  planningRoutineId: string | null;
  iotDeviceId: string | null;
  status: TherapySessionStatus | null;
  sensorsPlaced: boolean | null;
  startedAt: string | null;
  finalizedAt: string | null;
  cancellationReason: string | null;
  totalSeries: number | null;
  completedSeries: number | null;
  totalRepetitions: number | null;
  goodRepetitions: number | null;
  incompleteRepetitions: number | null;
  unsafeRepetitions: number | null;
  averageAchievedRom: number | null;
  painLevel: number | null;
  painReportsCount: number | null;
  highPainReportsCount: number | null;
  maxReportedPainLevel: number | null;
  requiresClinicalReview: boolean | null;
  compensatoryMovementsDetected: number | null;
  series: SerieExecutionResponse[] | null;
  compensatoryMovements: CompensatoryMovementResponse[] | null;
}

export interface DailyScheduleResource {
  patientId: string;
  date: string;
  resolutionStatus: DailyScheduleResolutionStatus | null;
  routineId: string | null;
  totalSeries: number | null;
  estimatedDurationMinutes: number | null;
}

export interface DailyScheduleResponse extends BaseResponse {
  patientId: string;
  date: string;
  resolutionStatus: DailyScheduleResolutionStatus | null;
  routineId: string | null;
  totalSeries: number | null;
  estimatedDurationMinutes: number | null;
}

export interface SerieDetailsResource {
  serieId: string;
  exerciseId: string | null;
  targetRepetitions: number | null;
  targetRom: number | null;
  movementType: ExerciseMovementType | null;
  bodyPart: ExerciseBodyPart | null;
  durationSeconds: number | null;
  restDurationSeconds: number | null;
  status: TherapySerieStatus | null;
}

export interface SerieDetailsResponse extends BaseResponse {
  serieId: string;
  exerciseId: string | null;
  targetRepetitions: number | null;
  targetRom: number | null;
  movementType: ExerciseMovementType | null;
  bodyPart: ExerciseBodyPart | null;
  durationSeconds: number | null;
  restDurationSeconds: number | null;
  status: TherapySerieStatus | null;
}

export interface SerieProgressResource {
  serieId: string;
  exerciseId: string | null;
  currentRepetitions: number | null;
  targetRepetitions: number | null;
  status: TherapySerieStatus | null;
}

export interface SerieProgressResponse extends BaseResponse {
  serieId: string;
  exerciseId: string | null;
  currentRepetitions: number | null;
  targetRepetitions: number | null;
  status: TherapySerieStatus | null;
}

export interface SessionProgressResource {
  sessionId: string;
  status: TherapySessionStatus | null;
  currentSerieId: string | null;
  completedSeries: number | null;
  totalSeries: number | null;
  painLevel: number | null;
  requiresClinicalReview: boolean | null;
  seriesProgress: SerieProgressResource[];
}

export interface SessionProgressResponse extends BaseResponse {
  sessionId: string;
  status: TherapySessionStatus | null;
  currentSerieId: string | null;
  completedSeries: number | null;
  totalSeries: number | null;
  painLevel: number | null;
  requiresClinicalReview: boolean | null;
  seriesProgress: SerieProgressResponse[] | null;
}
