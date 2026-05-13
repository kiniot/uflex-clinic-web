import {Component, computed, inject, model} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {TranslateService} from '@ngx-translate/core';
import {SelectModule} from 'primeng/select';
import {SearchInput} from '../../../../shared/presentation/components/search-input/search-input';
import {ExerciseCategory, ExerciseDifficulty} from '../../../domain/model/exercise.types';

interface SelectOption<T> {
  label: string;
  value: T;
}

/**
 * Filter bar for the therapy catalog: text search by exercise name plus
 * three dropdowns (category, difficulty, equipment). State is exposed via
 * model() inputs so the host can bind two-way and drive a computed list.
 */
@Component({
  selector: 'app-exercise-filters',
  imports: [FormsModule, SelectModule, SearchInput],
  templateUrl: './exercise-filters.html',
  styleUrl: './exercise-filters.scss'
})
export class ExerciseFilters {
  private translate = inject(TranslateService);

  search = model<string>('');
  category = model<ExerciseCategory | 'all'>('all');
  difficulty = model<ExerciseDifficulty | 'all'>('all');
  equipment = model<string>('all');

  private readonly translations = toSignal(
    this.translate.stream([
      'therapyManagement.filters.searchPlaceholder',
      'therapyManagement.filters.allCategories',
      'therapyManagement.filters.anyDifficulty',
      'therapyManagement.filters.anyEquipment',
      'therapyManagement.category.mobility',
      'therapyManagement.category.strength',
      'therapyManagement.category.endurance',
      'therapyManagement.difficulty.beginner',
      'therapyManagement.difficulty.intermediate',
      'therapyManagement.difficulty.advanced',
      'therapyManagement.equipment.therapyBall',
      'therapyManagement.equipment.resistanceBand',
      'therapyManagement.equipment.none'
    ]),
    {initialValue: {} as Record<string, string>}
  );

  protected searchPlaceholder = computed(() =>
    this.translations()['therapyManagement.filters.searchPlaceholder'] ?? ''
  );

  protected categoryOptions = computed<SelectOption<ExerciseCategory | 'all'>[]>(() => [
    {label: this.translations()['therapyManagement.filters.allCategories'] ?? '', value: 'all'},
    {label: this.translations()['therapyManagement.category.mobility'] ?? '', value: 'mobility'},
    {label: this.translations()['therapyManagement.category.strength'] ?? '', value: 'strength'},
    {label: this.translations()['therapyManagement.category.endurance'] ?? '', value: 'endurance'}
  ]);

  protected difficultyOptions = computed<SelectOption<ExerciseDifficulty | 'all'>[]>(() => [
    {label: this.translations()['therapyManagement.filters.anyDifficulty'] ?? '', value: 'all'},
    {label: this.translations()['therapyManagement.difficulty.beginner'] ?? '', value: 'beginner'},
    {label: this.translations()['therapyManagement.difficulty.intermediate'] ?? '', value: 'intermediate'},
    {label: this.translations()['therapyManagement.difficulty.advanced'] ?? '', value: 'advanced'}
  ]);

  protected equipmentOptions = computed<SelectOption<string>[]>(() => [
    {label: this.translations()['therapyManagement.filters.anyEquipment'] ?? '', value: 'all'},
    {label: this.translations()['therapyManagement.equipment.therapyBall'] ?? '', value: 'Therapy Ball'},
    {label: this.translations()['therapyManagement.equipment.resistanceBand'] ?? '', value: 'Resistance Band'},
    {label: this.translations()['therapyManagement.equipment.none'] ?? '', value: 'none'}
  ]);
}
