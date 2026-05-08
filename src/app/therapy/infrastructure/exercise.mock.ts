import {Exercise} from '../domain/model/exercise.entity';

/**
 * In-memory exercise catalog used while the Therapy backend is not yet
 * wired. Replace with an HTTP endpoint + assembler once the API is ready.
 */
export const MOCK_EXERCISES: Exercise[] = [
  new Exercise({
    id: 1,
    name: 'Wrist Extensions',
    description: 'Slowly bend the wrist back to improve range of motion in the joint.',
    category: 'mobility',
    difficulty: 'beginner',
    equipment: null,
    icon: 'pi-arrow-up',
    metrics: [
      {icon: 'pi-clock', label: '10s hold'},
      {icon: 'pi-replay', label: '10 reps'}
    ]
  }),
  new Exercise({
    id: 2,
    name: 'Grip Strengthening',
    description: 'Squeeze a therapy ball to rebuild hand and forearm strength.',
    category: 'strength',
    difficulty: 'intermediate',
    equipment: 'Therapy Ball',
    icon: 'pi-circle-fill',
    metrics: [
      {icon: 'pi-arrow-up-right', label: 'Medium Ball'},
      {icon: 'pi-replay', label: '3×15 reps'}
    ]
  }),
  new Exercise({
    id: 3,
    name: 'Elbow Flexion',
    description: 'Controlled bending of the elbow to restore full mobility.',
    category: 'mobility',
    difficulty: 'beginner',
    equipment: null,
    icon: 'pi-arrow-up-right',
    metrics: [
      {icon: 'pi-clock', label: 'Slow Pace'},
      {icon: 'pi-replay', label: '12 reps'}
    ]
  }),
  new Exercise({
    id: 4,
    name: 'Wrist Rotations',
    description: 'Rotating the forearm to improve rotation mobility in the wrist.',
    category: 'mobility',
    difficulty: 'beginner',
    equipment: null,
    icon: 'pi-refresh',
    metrics: [
      {icon: 'pi-clock', label: 'Controlled'},
      {icon: 'pi-replay', label: '15 reps'}
    ]
  })
];
