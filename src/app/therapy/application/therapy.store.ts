import {Injectable, computed, signal} from '@angular/core';
import {Exercise} from '../domain/model/exercise.entity';
import {ExerciseCategory, ExerciseMetric} from '../domain/model/exercise.types';
import {RegisterExerciseCommand} from '../domain/model/register-exercise.command';
import {LibraryProtocol} from '../domain/model/library-protocol';
import {TherapyOverview} from '../domain/model/therapy-overview';
import {TherapyPatient} from '../domain/model/therapy-patient.entity';
import {MOCK_EXERCISES} from '../infrastructure/exercise.mock';
import {MOCK_LIBRARY_PROTOCOLS} from '../infrastructure/library-protocol.mock';
import {MOCK_THERAPY_OVERVIEW} from '../infrastructure/therapy-overview.mock';
import {MOCK_THERAPY_PATIENTS} from '../infrastructure/therapy-patient.mock';

const CATEGORY_DEFAULT_ICON: Record<ExerciseCategory, string> = {
  mobility: 'pi-arrow-up',
  strength: 'pi-circle-fill',
  endurance: 'pi-bolt'
};

/**
 * Application-layer store for the Therapy bounded context. Holds the
 * catalog as a signal so any view (catalog grid, registration form,
 * future details page) reads the same source.
 *
 * Exercises start from an in-memory mock; once the Therapy API exists,
 * the constructor will hydrate from `iamApi.getAll()` instead and
 * `register()` will POST through an assembler.
 */
@Injectable({providedIn: 'root'})
export class TherapyStore {
  private readonly exercisesSignal = signal<Exercise[]>(MOCK_EXERCISES);
  private readonly patientsSignal = signal<TherapyPatient[]>(MOCK_THERAPY_PATIENTS);
  private readonly overviewSignal = signal<TherapyOverview>(MOCK_THERAPY_OVERVIEW);
  private readonly libraryProtocolsSignal = signal<LibraryProtocol[]>(MOCK_LIBRARY_PROTOCOLS);

  readonly exercises = this.exercisesSignal.asReadonly();
  readonly patients = this.patientsSignal.asReadonly();
  readonly overview = this.overviewSignal.asReadonly();
  readonly libraryProtocols = this.libraryProtocolsSignal.asReadonly();

  readonly connectedPatientsCount = computed(
    () => this.patients().filter(p => p.iotStatus === 'connected').length
  );

  readonly devicesUsagePct = computed(() => {
    const o = this.overview();
    if (o.totalDevices === 0) return 0;
    return Math.round((o.activeDevices / o.totalDevices) * 100);
  });

  /**
   * Creates an Exercise from the user's command and prepends it to the
   * catalog. Returns the entity so callers can navigate to its detail.
   */
  register(command: RegisterExerciseCommand): Exercise {
    const exercise = this.commandToEntity(command);
    this.exercisesSignal.update(list => [exercise, ...list]);
    return exercise;
  }

  private commandToEntity(command: RegisterExerciseCommand): Exercise {
    const nextId = Math.max(0, ...this.exercises().map(e => e.id)) + 1;
    return new Exercise({
      id: nextId,
      name: command.name,
      description: command.description,
      category: command.category,
      difficulty: command.difficulty,
      equipment: command.equipment,
      icon: CATEGORY_DEFAULT_ICON[command.category],
      metrics: this.metricsFor(command)
    });
  }

  private metricsFor(command: RegisterExerciseCommand): ExerciseMetric[] {
    const repsLabel = command.defaultSets > 1
      ? `${command.defaultSets}×${command.defaultReps} reps`
      : `${command.defaultReps} reps`;

    const primary: ExerciseMetric = command.holdDurationSec > 0
      ? {icon: 'pi-clock', label: `${command.holdDurationSec}s hold`}
      : {icon: 'pi-clock', label: 'Standard pace'};

    return [primary, {icon: 'pi-replay', label: repsLabel}];
  }
}
