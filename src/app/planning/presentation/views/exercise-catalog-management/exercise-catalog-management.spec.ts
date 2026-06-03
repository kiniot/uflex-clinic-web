import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { PlanningStore } from '../../../application/planning.store';
import { ExerciseCatalogManagement } from './exercise-catalog-management';

describe('ExerciseCatalogManagement', () => {
  const loadExerciseCatalog = vi.fn().mockResolvedValue([]);

  beforeEach(async () => {
    loadExerciseCatalog.mockClear();

    await TestBed.configureTestingModule({
      imports: [ExerciseCatalogManagement, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        MessageService,
        {
          provide: PlanningStore,
          useValue: {
            exerciseCatalog: signal([]).asReadonly(),
            isLoadingExerciseCatalog: signal(false).asReadonly(),
            exerciseCatalogError: signal(null).asReadonly(),
            isDeletingExercise: signal(false).asReadonly(),
            loadExerciseCatalog,
            deleteExercise: vi.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  it('loads the exercise catalog on init and renders the empty state', () => {
    const fixture = TestBed.createComponent(ExerciseCatalogManagement);
    fixture.detectChanges();

    expect(loadExerciseCatalog).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('exerciseCatalogAdmin.empty.title');
  });
});
