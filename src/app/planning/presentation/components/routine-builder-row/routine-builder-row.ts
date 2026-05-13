import {Component, input, output} from '@angular/core';
import {RoutineExercise} from '../../../domain/model/routine-exercise.entity';

interface ParamChangeEvent {
  exerciseId: number;
  paramKey: string;
  delta: number;
}

/**
 * Single row inside the Daily Routine Builder. Displays a thumbnail,
 * the exercise name and description, and a horizontal list of
 * parameters — counter parameters get -/+ buttons; static ones are
 * rendered as read-only labels. Emits {@link paramChange} when the
 * clinician adjusts a counter and {@link remove} for the trash icon.
 */
@Component({
  selector: 'app-routine-builder-row',
  imports: [],
  templateUrl: './routine-builder-row.html',
  styleUrl: './routine-builder-row.scss'
})
export class RoutineBuilderRow {
  exercise = input.required<RoutineExercise>();

  readonly paramChange = output<ParamChangeEvent>();
  readonly remove = output<RoutineExercise>();

  protected onAdjust(paramKey: string, delta: number) {
    this.paramChange.emit({exerciseId: this.exercise().id, paramKey, delta});
  }

  protected onRemove() {
    this.remove.emit(this.exercise());
  }
}
