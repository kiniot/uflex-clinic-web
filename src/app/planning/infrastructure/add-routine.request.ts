import { ExerciseSeriesItem, RoutineSchedule } from '../domain/model/treatment-plan.types';

export interface AddRoutineRequest {
  name: string;
  order: number;
  schedule: RoutineSchedule;
  exerciseSeries: ExerciseSeriesItem[];
}
