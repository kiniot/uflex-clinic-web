import {Component, computed, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Exercise} from '../../../domain/model/exercise.entity';

/**
 * Single exercise card rendered inside the therapy catalog grid.
 * Shows the category tag, a representative icon, name, description, the
 * key metrics, and the View Details + add-to-list actions.
 */
@Component({
  selector: 'app-exercise-card',
  imports: [TranslatePipe],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.scss'
})
export class ExerciseCard {
  exercise = input.required<Exercise>();

  readonly viewDetails = output<Exercise>();
  readonly addToList = output<Exercise>();

  protected categoryKey = computed(() =>
    `therapyManagement.category.${this.exercise().category}`
  );

  protected onViewDetails() { this.viewDetails.emit(this.exercise()); }
  protected onAddToList() { this.addToList.emit(this.exercise()); }
}
