import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PlanningStore } from './planning.store';
import { PlanningApi } from '../infrastructure/planning-api';

describe('PlanningStore', () => {
  let store: PlanningStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlanningStore,
        {
          provide: PlanningApi,
          useValue: {
            getTreatmentPlansByPatient: () => of([]),
            getTreatmentPlan: () => of(null),
            createTreatmentPlan: () => of(null),
            updateTreatmentPlan: () => of(null),
            activateTreatmentPlan: () => of(null),
            completeTreatmentPlan: () => of(null),
            cancelTreatmentPlan: () => of(null),
            deleteTreatmentPlan: () => of(void 0),
            addRoutine: () => of(null),
            updateRoutine: () => of(null),
            deleteRoutine: () => of(null),
            getExercises: () =>
              of([
                {
                  id: 'exercise-1',
                  name: 'Wrist supination',
                  description: 'Controlled wrist supination exercise.',
                  bodyPart: 'WRIST',
                  movementType: 'SUPINATION',
                  videoUrl: 'https://cdn.uflex.app/exercises/wrist-supination.mp4',
                },
              ]),
            getExerciseById: () =>
              of({
                id: 'exercise-2',
                name: 'Elbow flexion',
                description: 'Controlled elbow flexion exercise.',
                bodyPart: 'ELBOW',
                movementType: 'FLEXION',
                videoUrl: null,
              }),
          },
        },
      ],
    });

    store = TestBed.inject(PlanningStore);
  });

  it('loads the exercise catalog into the planning workspace', async () => {
    await store.loadExerciseCatalog();

    expect(store.exerciseCatalog().length).toBe(1);
    expect(store.exerciseCatalog()[0]?.id).toBe('exercise-1');
    expect(store.exerciseCatalog()[0]?.movementType).toBe('SUPINATION');
  });

  it('loads a single exercise by id and keeps it selected', async () => {
    const exercise = await store.loadExerciseById('exercise-2');

    expect(exercise?.id).toBe('exercise-2');
    expect(store.selectedExerciseCatalogItem()?.id).toBe('exercise-2');
    expect(store.exerciseCatalog().some((item) => item.id === 'exercise-2')).toBe(true);
  });

  it('exposes a recoverable error state when the exercise catalog request fails', async () => {
    const api = TestBed.inject(PlanningApi);
    api.getExercises = () => throwError(() => new Error('Failed to load exercises'));

    const exercises = await store.loadExerciseCatalog();

    expect(exercises).toEqual([]);
    expect(store.exerciseCatalog()).toEqual([]);
    expect(store.exerciseCatalogError()).toBe('Failed to load exercises');
  });
});
