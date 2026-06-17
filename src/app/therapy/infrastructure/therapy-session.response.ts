import { BaseResponse } from '../../shared/infrastructure/base-response';
import {
  DailyScheduleResolutionStatus,
  TherapySerieStatus,
  TherapySessionStatus,
} from '../domain/model/therapy-session.types';

export interface TherapySessionResource {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  iotDeviceId: string;
  snapshotDeviceId: string | null;
  snapshotSensorsPlaced: boolean | null;
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
  snapshotDeviceId: string | null;
  snapshotSensorsPlaced: boolean | null;
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
  painLevel: number | null;
  painReportsCount: number | null;
  highPainReportsCount: number | null;
  maxReportedPainLevel: number | null;
  requiresClinicalReview: boolean | null;
  anomaliesDetected: number | null;
  startedAt: string | null;
  finalizedAt: string | null;
}

export interface SessionSummaryResponse extends BaseResponse {
  sessionId: string;
  patientId: string;
  totalSeries: number | null;
  completedSeries: number | null;
  painLevel: number | null;
  painReportsCount: number | null;
  highPainReportsCount: number | null;
  maxReportedPainLevel: number | null;
  requiresClinicalReview: boolean | null;
  anomaliesDetected: number | null;
  startedAt: string | null;
  finalizedAt: string | null;
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
  minAngle: number | null;
  maxAngle: number | null;
  durationSeconds: number | null;
  restDurationSeconds: number | null;
  status: TherapySerieStatus | null;
}

export interface SerieDetailsResponse extends BaseResponse {
  serieId: string;
  exerciseId: string | null;
  targetRepetitions: number | null;
  minAngle: number | null;
  maxAngle: number | null;
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
