import {
  ExerciseSeriesItem,
  RoutineSchedule,
  TreatmentPlanPeriod,
} from '../domain/model/treatment-plan.types';

export interface CreateTreatmentPlanRequest {
  name: string;
  period: TreatmentPlanPeriod;
  routines: Array<{
    name: string;
    order: number;
    schedule: RoutineSchedule;
    exerciseSeries: ExerciseSeriesItem[];
  }>;
}
