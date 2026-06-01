import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface TreatmentPlanPeriodResource {
  startsAt: string;
  endsAt: string;
}

export interface TreatmentPlanRoutineScheduleResource {
  dayOfWeek: string;
  scheduledTime: string;
}

export interface ExerciseSeriesItemResource {
  order: number;
  exerciseId: string;
  rangeOfMotionDegrees: number;
  repetitions: number;
  durationSeconds: number;
  restDurationSeconds: number;
}

export interface TreatmentPlanRoutineResource {
  id: string | null;
  name: string;
  order: number;
  schedule: TreatmentPlanRoutineScheduleResource;
  exerciseSeries: ExerciseSeriesItemResource[];
}

export interface TreatmentPlanResource extends BaseResource {
  id: string;
  patientId: string;
  name: string;
  status: string;
  period: TreatmentPlanPeriodResource;
  routines: TreatmentPlanRoutineResource[];
}

export interface TreatmentPlanResponse extends BaseResponse {
  id: string;
  patientId: string;
  name: string;
  status: string;
  period: TreatmentPlanPeriodResource;
  routines: TreatmentPlanRoutineResource[];
}
