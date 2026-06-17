export type TherapySessionStatus = 'Pending' | 'Ready' | 'InProgress' | 'Completed' | 'Cancelled';

export type TherapySerieStatus = 'Pending' | 'Started' | 'Validated';

export type DailyScheduleResolutionStatus =
  | 'FOUND'
  | 'NO_ROUTINE_FOR_DAY'
  | 'NO_ACTIVE_PLAN_FOR_DATE';

export interface DailySchedule {
  patientId: string;
  date: string;
  resolutionStatus: DailyScheduleResolutionStatus | null;
  routineId: string | null;
  totalSeries: number;
  estimatedDurationMinutes: number;
}

export interface SerieDetails {
  serieId: string;
  exerciseId: string | null;
  targetRepetitions: number | null;
  minAngle: number | null;
  maxAngle: number | null;
  durationSeconds: number | null;
  restDurationSeconds: number | null;
  status: TherapySerieStatus | null;
}

export interface SerieProgress {
  serieId: string;
  exerciseId: string | null;
  currentRepetitions: number | null;
  targetRepetitions: number | null;
  status: TherapySerieStatus | null;
}

export interface SessionProgress {
  sessionId: string;
  status: TherapySessionStatus | null;
  currentSerieId: string | null;
  completedSeries: number | null;
  totalSeries: number | null;
  painLevel: number | null;
  requiresClinicalReview: boolean | null;
  seriesProgress: SerieProgress[];
}

export interface SessionSummary {
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
