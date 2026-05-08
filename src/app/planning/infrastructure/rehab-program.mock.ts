import {RehabProgram} from '../domain/model/rehab-program.entity';
import {RoutineExercise} from '../domain/model/routine-exercise.entity';

const ROUTINE: RoutineExercise[] = [
  new RoutineExercise({
    id: 201,
    name: 'Weighted Leg Extensions',
    description: 'Focus on slow eccentric phase for health.',
    parameters: [
      {type: 'counter', key: 'sets', label: 'Sets', value: 3},
      {type: 'counter', key: 'reps', label: 'Reps', value: 12},
      {type: 'counter', key: 'rest', label: 'Rest (s)', value: 60},
      {type: 'counter', key: 'load', label: 'Load', value: 15, unit: 'kg'}
    ]
  }),
  new RoutineExercise({
    id: 202,
    name: 'Isometric Quadriceps',
    description: 'Hold each contraction for 5–10 seconds.',
    parameters: [
      {type: 'counter', key: 'sets', label: 'Sets', value: 4},
      {type: 'counter', key: 'holds', label: 'Holds', value: 10},
      {type: 'static', key: 'rest', label: 'Rest', value: '30s'},
      {type: 'static', key: 'intensity', label: 'Intensity', value: 'Moderate'}
    ]
  })
];

/**
 * Mock rehab program for Marcus Thompson — drives the Therapy Roadmap.
 * Will be replaced by GET /rehab-programs/:id when the backend lands.
 */
export const MOCK_REHAB_PROGRAM: RehabProgram = new RehabProgram({
  id: 1,
  patientName: 'Marcus Thompson',
  patientAge: 42,
  patientGender: 'Male',
  patientCondition: 'ACL Surgery',
  phases: [
    {id: 'protection', label: 'Protection', status: 'completed'},
    {id: 'strength', label: 'Strength', status: 'active'},
    {id: 'impact', label: 'Impact', status: 'upcoming'},
    {id: 'rtp', label: 'RTP', status: 'upcoming'}
  ],
  currentPhase: 'strength',
  dayNumber: 24,
  totalDays: 90,
  scheduleLabel: 'Mon, Wed, Fri',
  routineExercises: ROUTINE
});
