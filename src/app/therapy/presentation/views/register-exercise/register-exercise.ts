import {Component, computed, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SelectModule} from 'primeng/select';
import {TextareaModule} from 'primeng/textarea';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {TherapyStore} from '../../../application/therapy.store';
import {ExerciseBodyPart, ExerciseCategory, ExerciseDifficulty} from '../../../domain/model/exercise.types';
import {RegisterExerciseCommand} from '../../../domain/model/register-exercise.command';

interface SelectOption<T> {
  label: string;
  value: T;
}

/**
 * View for creating a new Exercise in the Therapy catalog. Replaces the
 * Therapy Management content while keeping the admin shell. On save it
 * pushes the command to the TherapyStore and navigates back to the grid.
 */
@Component({
  selector: 'app-register-exercise',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    ButtonModule,
    InputTextModule,
    RadioButtonModule,
    SelectModule,
    TextareaModule,
    PageHeader
  ],
  templateUrl: './register-exercise.html',
  styleUrl: './register-exercise.scss'
})
export class RegisterExercise extends BaseForm {
  private translate = inject(TranslateService);
  private router = inject(Router);
  private store = inject(TherapyStore);

  protected readonly mediaFileName = signal<string | null>(null);

  form = new FormGroup({
    name: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    category: new FormControl<ExerciseCategory | null>(null, {validators: [Validators.required]}),
    bodyPart: new FormControl<ExerciseBodyPart | null>(null, {validators: [Validators.required]}),
    description: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    defaultSets: new FormControl<number>(3, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    defaultReps: new FormControl<number>(10, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    holdDurationSec: new FormControl<number>(0, {nonNullable: true, validators: [Validators.min(0)]}),
    difficulty: new FormControl<ExerciseDifficulty>('intermediate', {nonNullable: true, validators: [Validators.required]}),
    equipment: new FormControl('', {nonNullable: true})
  });

  private readonly translations = toSignal(
    this.translate.stream([
      'therapyManagement.category.mobility',
      'therapyManagement.category.strength',
      'therapyManagement.category.endurance',
      'therapyManagement.bodyPart.wrist',
      'therapyManagement.bodyPart.elbow',
      'therapyManagement.bodyPart.shoulder',
      'therapyManagement.bodyPart.hand',
      'therapyManagement.bodyPart.forearm',
      'therapyManagement.bodyPart.knee',
      'therapyManagement.bodyPart.ankle',
      'therapyManagement.bodyPart.other'
    ]),
    {initialValue: {} as Record<string, string>}
  );

  protected categoryOptions = computed<SelectOption<ExerciseCategory>[]>(() => [
    {label: this.translations()['therapyManagement.category.mobility'] ?? '', value: 'mobility'},
    {label: this.translations()['therapyManagement.category.strength'] ?? '', value: 'strength'},
    {label: this.translations()['therapyManagement.category.endurance'] ?? '', value: 'endurance'}
  ]);

  protected bodyPartOptions = computed<SelectOption<ExerciseBodyPart>[]>(() => [
    {label: this.translations()['therapyManagement.bodyPart.wrist'] ?? '', value: 'wrist'},
    {label: this.translations()['therapyManagement.bodyPart.elbow'] ?? '', value: 'elbow'},
    {label: this.translations()['therapyManagement.bodyPart.shoulder'] ?? '', value: 'shoulder'},
    {label: this.translations()['therapyManagement.bodyPart.hand'] ?? '', value: 'hand'},
    {label: this.translations()['therapyManagement.bodyPart.forearm'] ?? '', value: 'forearm'},
    {label: this.translations()['therapyManagement.bodyPart.knee'] ?? '', value: 'knee'},
    {label: this.translations()['therapyManagement.bodyPart.ankle'] ?? '', value: 'ankle'},
    {label: this.translations()['therapyManagement.bodyPart.other'] ?? '', value: 'other'}
  ]);

  protected onFilePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.mediaFileName.set(file?.name ?? null);
  }

  protected onCancel() {
    this.router.navigate(['/clinic-admin/therapy']);
  }

  protected onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    const command = new RegisterExerciseCommand({
      name: value.name,
      category: value.category!,
      bodyPart: value.bodyPart!,
      description: value.description,
      defaultSets: value.defaultSets,
      defaultReps: value.defaultReps,
      holdDurationSec: value.holdDurationSec,
      difficulty: value.difficulty,
      equipment: value.equipment.trim() ? value.equipment.trim() : null,
      mediaFileName: this.mediaFileName()
    });

    this.store.register(command);
    this.router.navigate(['/clinic-admin/therapy']);
  }
}
