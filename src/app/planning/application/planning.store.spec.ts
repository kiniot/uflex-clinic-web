import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PlanningStore } from './planning.store';
import { PlanningApi } from '../infrastructure/planning-api';

describe('PlanningStore', () => {
  let store: PlanningStore;
  let api: PlanningApi;

  beforeEach(() => {
    const planningApiMock = {
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
      createExercise: () =>
        of({
          id: 'exercise-3',
          name: 'Wrist extension',
          description: 'Controlled wrist extension exercise.',
          bodyPart: 'WRIST',
          movementType: 'EXTENSION',
          videoUrl: null,
        }),
      updateExercise: () =>
        of({
          id: 'exercise-1',
          name: 'Wrist supination progression',
          description: 'Updated wrist supination exercise.',
          bodyPart: 'WRIST',
          movementType: 'SUPINATION',
          videoUrl: 'https://cdn.uflex.app/exercises/wrist-supination-v2.mp4',
        }),
      deleteExercise: () => of(void 0),
    };

    TestBed.configureTestingModule({
      providers: [
        PlanningStore,
        {
          provide: PlanningApi,
          useValue: planningApiMock,
        },
      ],
    });

    store = TestBed.inject(PlanningStore);
    api = TestBed.inject(PlanningApi);
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
    api.getExercises = () => throwError(() => new Error('Failed to load exercises'));

    const exercises = await store.loadExerciseCatalog();

    expect(exercises).toEqual([]);
    expect(store.exerciseCatalog()).toEqual([]);
    expect(store.exerciseCatalogError()).toBe('Failed to load exercises');
  });

  it('creates an exercise and prepends it to the catalog', async () => {
    const exercise = await store.createExercise({
      name: 'Wrist extension',
      description: 'Controlled wrist extension exercise.',
      bodyPart: 'WRIST',
      movementType: 'EXTENSION',
      videoUrl: null,
    } as any);

    expect(exercise.id).toBe('exercise-3');
    expect(store.exerciseCatalog()[0]?.id).toBe('exercise-3');
    expect(store.selectedExerciseCatalogItem()?.id).toBe('exercise-3');
  });

  it('updates an exercise and keeps the catalog synchronized', async () => {
    await store.loadExerciseCatalog();

    const updated = await store.updateExercise('exercise-1', {
      name: 'Wrist supination progression',
      description: 'Updated wrist supination exercise.',
      bodyPart: 'WRIST',
      movementType: 'SUPINATION',
      videoUrl: 'https://cdn.uflex.app/exercises/wrist-supination-v2.mp4',
    } as any);

    expect(updated.name).toBe('Wrist supination progression');
    expect(store.exerciseCatalog()[0]?.name).toBe('Wrist supination progression');
    expect(store.selectedExerciseCatalogItem()?.videoUrl).toContain('v2');
  });

  it('deletes an exercise from the catalog and clears selection when needed', async () => {
    await store.loadExerciseCatalog();
    await store.loadExerciseById('exercise-2');

    await store.deleteExercise('exercise-2');

    expect(store.exerciseCatalog().some((item) => item.id === 'exercise-2')).toBe(false);
    expect(store.selectedExerciseCatalogItem()).toBeNull();
  });
});
