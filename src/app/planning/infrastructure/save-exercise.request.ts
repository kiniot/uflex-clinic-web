export interface SaveExerciseRequest {
  name: string;
  description: string;
  bodyPart: 'ELBOW' | 'WRIST';
  movementType: 'PRONATION' | 'SUPINATION' | 'FLEXION' | 'EXTENSION';
  videoUrl: string | null;
}
