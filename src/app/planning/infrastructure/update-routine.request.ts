import { ExerciseSeriesItem, RoutineSchedule } from '../domain/model/treatment-plan.types';

export interface UpdateRoutineRequest {
  name: string;
  newOrder: number;
  schedule: RoutineSchedule;
  exerciseSeries: ExerciseSeriesItem[];
}
