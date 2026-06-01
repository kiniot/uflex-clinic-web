import { ExerciseSeriesItem, RoutineSchedule, TreatmentPlanPeriod } from '../domain/model/treatment-plan.types';

export interface CreateTreatmentPlanRequest {
  name: string;
  status: string;
  period: TreatmentPlanPeriod;
  routines: Array<{
    name: string;
    order: number;
    schedule: RoutineSchedule;
    exerciseSeries: ExerciseSeriesItem[];
  }>;
}
