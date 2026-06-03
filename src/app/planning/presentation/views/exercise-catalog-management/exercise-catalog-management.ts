import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { PlanningStore } from '../../../application/planning.store';
import { ExerciseCatalogItem } from '../../../domain/model/exercise-catalog-item.entity';
import { ConfirmActionDialog } from '../../../../shared/presentation/components/confirm-action-dialog/confirm-action-dialog';
import { PageHeader } from '../../../../shared/presentation/components/page-header/page-header';
import { SearchInput } from '../../../../shared/presentation/components/search-input/search-input';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-exercise-catalog-management',
  imports: [
    FormsModule,
    TranslatePipe,
    ButtonModule,
    SelectModule,
    TooltipModule,
    ConfirmActionDialog,
    PageHeader,
    SearchInput,
  ],
  templateUrl: './exercise-catalog-management.html',
  styleUrl: './exercise-catalog-management.scss',
})
export class ExerciseCatalogManagement implements OnInit {
  private readonly planningStore = inject(PlanningStore);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  private readonly translations = toSignal(
    this.translate.stream([
      'exerciseCatalogAdmin.filters.allBodyParts',
      'exerciseCatalogAdmin.filters.allMovementTypes',
      'exerciseCatalogAdmin.bodyPart.ELBOW',
      'exerciseCatalogAdmin.bodyPart.WRIST',
      'exerciseCatalogAdmin.movementType.PRONATION',
      'exerciseCatalogAdmin.movementType.SUPINATION',
      'exerciseCatalogAdmin.movementType.FLEXION',
      'exerciseCatalogAdmin.movementType.EXTENSION',
    ]),
    { initialValue: {} as Record<string, string> },
  );

  protected readonly exerciseCatalog = this.planningStore.exerciseCatalog;
  protected readonly isLoadingExerciseCatalog = this.planningStore.isLoadingExerciseCatalog;
  protected readonly exerciseCatalogError = this.planningStore.exerciseCatalogError;
  protected readonly isDeletingExercise = this.planningStore.isDeletingExercise;

  protected readonly search = signal('');
  protected readonly bodyPartFilter = signal<'all' | 'ELBOW' | 'WRIST'>('all');
  protected readonly movementTypeFilter = signal<
    'all' | 'PRONATION' | 'SUPINATION' | 'FLEXION' | 'EXTENSION'
  >('all');
  protected readonly confirmDeleteVisible = signal(false);
  protected readonly selectedExerciseForDelete = signal<ExerciseCatalogItem | null>(null);
  protected readonly loadingRows = [0, 1, 2, 3];

  protected readonly bodyPartOptions = computed<SelectOption<'all' | 'ELBOW' | 'WRIST'>[]>(() => [
    {
      label: this.translations()['exerciseCatalogAdmin.filters.allBodyParts'] ?? 'All body parts',
      value: 'all',
    },
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
    SelectOption<'all' | 'PRONATION' | 'SUPINATION' | 'FLEXION' | 'EXTENSION'>[]
  >(() => [
    {
      label:
        this.translations()['exerciseCatalogAdmin.filters.allMovementTypes'] ??
        'All movement types',
      value: 'all',
    },
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

  protected readonly filteredExercises = computed(() => {
    const term = this.search().trim().toLowerCase();
    const bodyPart = this.bodyPartFilter();
    const movementType = this.movementTypeFilter();

    return this.exerciseCatalog().filter((exercise) => {
      if (
        term &&
        !exercise.name.toLowerCase().includes(term) &&
        !exercise.description.toLowerCase().includes(term)
      ) {
        return false;
      }
      if (bodyPart !== 'all' && exercise.bodyPart !== bodyPart) {
        return false;
      }
      if (movementType !== 'all' && exercise.movementType !== movementType) {
        return false;
      }
      return true;
    });
  });

  ngOnInit(): void {
    void this.planningStore.loadExerciseCatalog();
  }

  protected openCreateExercise() {
    void this.router.navigate(['/clinic-admin/exercises/new']);
  }

  protected openEditExercise(exercise: ExerciseCatalogItem) {
    void this.router.navigate(['/clinic-admin/exercises', exercise.id, 'edit']);
  }

  protected onRequestDeleteExercise(exercise: ExerciseCatalogItem) {
    this.selectedExerciseForDelete.set(exercise);
    this.confirmDeleteVisible.set(true);
  }

  protected closeDeleteDialog() {
    if (this.isDeletingExercise()) {
      return;
    }
    this.confirmDeleteVisible.set(false);
    this.selectedExerciseForDelete.set(null);
  }

  protected async confirmDeleteExercise() {
    const exercise = this.selectedExerciseForDelete();
    if (!exercise) {
      return;
    }

    try {
      await this.planningStore.deleteExercise(exercise.id);
      this.closeDeleteDialog();
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('exerciseCatalogAdmin.notifications.deleteSuccessSummary'),
        detail: this.translate.instant('exerciseCatalogAdmin.notifications.deleteSuccessDetail', {
          name: exercise.name,
        }),
        life: 4000,
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('exerciseCatalogAdmin.notifications.deleteErrorSummary'),
        detail: this.translate.instant('exerciseCatalogAdmin.notifications.deleteErrorDetail'),
        life: 4500,
      });
    }
  }

  protected onRetry() {
    void this.planningStore.loadExerciseCatalog();
  }

  protected videoStatusLabel(exercise: ExerciseCatalogItem): string {
    return this.translate.instant(
      exercise.videoUrl
        ? 'exerciseCatalogAdmin.video.available'
        : 'exerciseCatalogAdmin.video.pending',
    );
  }
}
