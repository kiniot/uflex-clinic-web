import {Component, computed, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {TherapyStore} from '../../../application/therapy.store';
import {Exercise} from '../../../domain/model/exercise.entity';
import {ExerciseCategory, ExerciseDifficulty} from '../../../domain/model/exercise.types';
import {ExerciseCard} from '../../components/exercise-card/exercise-card';
import {ExerciseFilters} from '../../components/exercise-filters/exercise-filters';

/**
 * Therapy Management view in the Therapy bounded context. Renders the page
 * header, the filter bar, and the catalog grid. The exercise list is read
 * from TherapyStore so the registration view shares the same source.
 */
@Component({
  selector: 'app-therapy-management',
  imports: [
    RouterLink,
    TranslatePipe,
    ButtonModule,
    PageHeader,
    ExerciseFilters,
    ExerciseCard
  ],
  templateUrl: './therapy-management.html',
  styleUrl: './therapy-management.scss'
})
export class TherapyManagement {
  private readonly store = inject(TherapyStore);

  protected readonly exercises = this.store.exercises;

  protected readonly search = signal('');
  protected readonly category = signal<ExerciseCategory | 'all'>('all');
  protected readonly difficulty = signal<ExerciseDifficulty | 'all'>('all');
  protected readonly equipment = signal<string>('all');

  protected readonly filteredExercises = computed(() => {
    const term = this.search().trim().toLowerCase();
    const category = this.category();
    const difficulty = this.difficulty();
    const equipment = this.equipment();

    return this.exercises().filter(exercise => {
      if (term && !exercise.name.toLowerCase().includes(term)) return false;
      if (category !== 'all' && exercise.category !== category) return false;
      if (difficulty !== 'all' && exercise.difficulty !== difficulty) return false;
      if (equipment === 'none' && exercise.equipment !== null) return false;
      if (equipment !== 'all' && equipment !== 'none' && exercise.equipment !== equipment) return false;
      return true;
    });
  });

  protected onViewDetails(exercise: Exercise) {
    console.log('View details for', exercise.name);
  }

  protected onAddToList(exercise: Exercise) {
    console.log('Add to list', exercise.name);
  }
}
