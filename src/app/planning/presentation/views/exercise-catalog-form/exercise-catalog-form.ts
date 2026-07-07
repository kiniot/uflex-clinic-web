import { Component, computed, inject, OnInit, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { MediaAsset, MediaOwnerType } from '../../../../media/domain/model/media.model';
import { MediaUploader } from '../../../../media/presentation/media-uploader/media-uploader';
import { PlanningStore } from '../../../application/planning.store';
import { CreateExerciseCommand } from '../../../domain/model/create-exercise.command';
import { UpdateExerciseCommand } from '../../../domain/model/update-exercise.command';
import { BaseForm } from '../../../../shared/presentation/components/base-form/base-form';
import { PageHeader } from '../../../../shared/presentation/components/page-header/page-header';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-exercise-catalog-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    PageHeader,
    MediaUploader,
    TooltipModule,
  ],
  templateUrl: './exercise-catalog-form.html',
  styleUrl: './exercise-catalog-form.scss',
})
export class ExerciseCatalogForm extends BaseForm implements OnInit {
  private readonly planningStore = inject(PlanningStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  private readonly mediaUploaderRef = viewChild<MediaUploader>('mediaUploader');

  private readonly translations = toSignal(
    this.translate.stream([
      'exerciseCatalogAdmin.bodyPart.ELBOW',
      'exerciseCatalogAdmin.bodyPart.WRIST',
      'exerciseCatalogAdmin.movementType.PRONATION',
      'exerciseCatalogAdmin.movementType.SUPINATION',
      'exerciseCatalogAdmin.movementType.FLEXION',
      'exerciseCatalogAdmin.movementType.EXTENSION',
    ]),
    { initialValue: {} as Record<string, string> },
  );

  protected readonly isLoadingExercise = this.planningStore.isLoadingSelectedExerciseCatalogItem;
  protected readonly isSavingExercise = this.planningStore.isSavingExercise;
  protected readonly exerciseId = signal<string | null>(null);
  protected readonly videoPreviewUrl = signal<string | null>(null);
  protected readonly videoAssetIdChange = signal<string | null | undefined>(undefined);
  protected readonly isVideoUploading = signal(false);
  protected readonly isShellDragging = signal(false);
  protected readonly isEditMode = computed(() => this.exerciseId() !== null);
  protected readonly uploadOwnerType = computed<MediaOwnerType>(() =>
    this.isEditMode() ? 'EXERCISE_VIDEO' : 'GENERIC',
  );
  protected readonly hasVideo = computed(() => this.videoPreviewUrl() !== null);

  protected readonly bodyPartOptions = computed<SelectOption<'ELBOW' | 'WRIST'>[]>(() => [
    {
      label: this.translations()['exerciseCatalogAdmin.bodyPart.ELBOW'] ?? 'Elbow',
      value: 'ELBOW',
    },
    {
      label: this.translations()['exerciseCatalogAdmin.bodyPart.WRIST'] ?? 'Wrist',
      value: 'WRIST',
    },
  ]);

  protected readonly movementTypeOptions = computed<
    SelectOption<'PRONATION' | 'SUPINATION' | 'FLEXION' | 'EXTENSION'>[]
  >(() => [
    {
      label: this.translations()['exerciseCatalogAdmin.movementType.PRONATION'] ?? 'Pronation',
      value: 'PRONATION',
    },
    {
      label: this.translations()['exerciseCatalogAdmin.movementType.SUPINATION'] ?? 'Supination',
      value: 'SUPINATION',
    },
    {
      label: this.translations()['exerciseCatalogAdmin.movementType.FLEXION'] ?? 'Flexion',
      value: 'FLEXION',
    },
    {
      label: this.translations()['exerciseCatalogAdmin.movementType.EXTENSION'] ?? 'Extension',
      value: 'EXTENSION',
    },
  ]);

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    bodyPart: new FormControl<'ELBOW' | 'WRIST' | null>(null, {
      validators: [Validators.required],
    }),
    movementType: new FormControl<'PRONATION' | 'SUPINATION' | 'FLEXION' | 'EXTENSION' | null>(
      null,
      { validators: [Validators.required] },
    ),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    void this.initialize();
  }

  private async initialize(): Promise<void> {
    const exerciseId = this.route.snapshot.paramMap.get('exerciseId');
    this.exerciseId.set(exerciseId);

    if (!exerciseId) {
      this.planningStore.clearSelectedExerciseCatalogItem();
      this.videoPreviewUrl.set(null);
      this.videoAssetIdChange.set(undefined);
      this.isVideoUploading.set(false);
      return;
    }

    const exercise = await this.planningStore.loadExerciseById(exerciseId);
    if (!exercise) {
      return;
    }

    this.form.patchValue({
      name: exercise.name,
      bodyPart: exercise.bodyPart as 'ELBOW' | 'WRIST',
      movementType: exercise.movementType as 'PRONATION' | 'SUPINATION' | 'FLEXION' | 'EXTENSION',
      description: exercise.description,
    });
    this.videoPreviewUrl.set(exercise.videoUrl);
    this.videoAssetIdChange.set(undefined);
    this.isVideoUploading.set(false);
  }

  protected onVideoUploaded(asset: MediaAsset): void {
    this.videoAssetIdChange.set(asset.id);
    this.videoPreviewUrl.set(asset.downloadUrl);
  }

  protected onVideoUploadingChange(isUploading: boolean): void {
    this.isVideoUploading.set(isUploading);
  }

  protected onRemoveVideo(): void {
    this.videoAssetIdChange.set(null);
    this.videoPreviewUrl.set(null);
  }

  protected onReplaceVideo(): void {
    this.mediaUploaderRef()?.triggerPicker();
  }

  protected onShellDragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.hasVideo()) {
      this.isShellDragging.set(true);
    }
  }

  protected onShellDragLeave(event: DragEvent): void {
    event.preventDefault();
    const shell = event.currentTarget as HTMLElement;
    if (!shell.contains(event.relatedTarget as Node)) {
      this.isShellDragging.set(false);
    }
  }

  protected onShellDrop(event: DragEvent): void {
    event.preventDefault();
    this.isShellDragging.set(false);
    if (!this.hasVideo()) return;
    const files = event.dataTransfer?.files;
    if (files) {
      this.mediaUploaderRef()?.handleDroppedFiles(files);
    }
  }

  protected onCancel() {
    void this.router.navigate(['/clinic-admin/exercises']);
  }

  protected async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isVideoUploading()) {
      return;
    }

    const value = this.form.getRawValue();

    try {
      if (this.isEditMode() && this.exerciseId()) {
        await this.planningStore.updateExercise(
          this.exerciseId()!,
          new UpdateExerciseCommand({
            name: value.name.trim(),
            description: value.description.trim(),
            bodyPart: value.bodyPart!,
            movementType: value.movementType!,
            videoAssetId: this.videoAssetIdChange(),
          }),
        );
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('exerciseCatalogAdmin.notifications.editSuccessSummary'),
          detail: this.translate.instant('exerciseCatalogAdmin.notifications.editSuccessDetail', {
            name: value.name.trim(),
          }),
          life: 4000,
        });
      } else {
        await this.planningStore.createExercise(
          new CreateExerciseCommand({
            name: value.name.trim(),
            description: value.description.trim(),
            bodyPart: value.bodyPart!,
            movementType: value.movementType!,
            videoAssetId: this.videoAssetIdChange() ?? undefined,
          }),
        );
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant(
            'exerciseCatalogAdmin.notifications.createSuccessSummary',
          ),
          detail: this.translate.instant('exerciseCatalogAdmin.notifications.createSuccessDetail', {
            name: value.name.trim(),
          }),
          life: 4000,
        });
      }

      void this.router.navigate(['/clinic-admin/exercises']);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('exerciseCatalogAdmin.notifications.saveErrorSummary'),
        detail: this.translate.instant('exerciseCatalogAdmin.notifications.saveErrorDetail'),
        life: 4500,
      });
    }
  }
}
