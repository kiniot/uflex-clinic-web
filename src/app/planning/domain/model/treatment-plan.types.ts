export type TreatmentPlanStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELED';

export type TreatmentPlanDayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface TreatmentPlanPeriod {
  startsAt: string;
  endsAt: string;
}

export interface RoutineSchedule {
  dayOfWeek: TreatmentPlanDayOfWeek | string;
  scheduledTime: string;
}

export interface ExerciseSeriesItem {
  order: number;
  exerciseId: string;
  rangeOfMotionDegrees: number;
  repetitions: number;
  durationSeconds: number;
  restDurationSeconds: number;
}
