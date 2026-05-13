/**
 * Domain enumerations for the Therapy bounded context.
 */

export type ExerciseCategory = 'mobility' | 'strength' | 'endurance';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseBodyPart =
  | 'wrist'
  | 'elbow'
  | 'shoulder'
  | 'hand'
  | 'forearm'
  | 'knee'
  | 'ankle'
  | 'other';

/**
 * One key metric shown on the exercise card (e.g. "10s hold", "12 reps").
 * `icon` is a PrimeIcons class fragment such as `pi-clock`.
 */
export interface ExerciseMetric {
  icon: string;
  label: string;
}
