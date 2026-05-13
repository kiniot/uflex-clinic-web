import {Component, computed, inject, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {PlanningStore} from '../../../application/planning.store';
import {TherapyStore} from '../../../../therapy/application/therapy.store';
import {ProtocolTag} from '../../../../therapy/domain/model/library-protocol';
import {LongTermTrajectory} from '../../components/long-term-trajectory/long-term-trajectory';
import {RecoveryPhaseIndicator} from '../../components/recovery-phase-indicator/recovery-phase-indicator';
import {RoutineBuilderRow} from '../../components/routine-builder-row/routine-builder-row';

interface ParamChangeEvent {
  exerciseId: number;
  paramKey: string;
  delta: number;
}

/**
 * Therapy Roadmap view in the Planning bounded context. The
 * physiotherapist's primary planning workspace: patient header, four-
 * phase indicator, exercise library on the left, daily routine builder
 * on the right, and a long-term trajectory snapshot at the bottom.
 */
@Component({
  selector: 'app-therapy-roadmap',
  imports: [
    TranslatePipe,
    ButtonModule,
    RecoveryPhaseIndicator,
    RoutineBuilderRow,
    LongTermTrajectory
  ],
  templateUrl: './therapy-roadmap.html',
  styleUrl: './therapy-roadmap.scss'
})
export class TherapyRoadmap {
  private readonly planning = inject(PlanningStore);
  private readonly therapy = inject(TherapyStore);

  protected readonly program = this.planning.rehabProgram;
  protected readonly trajectory = this.planning.trajectory;
  protected readonly progressPct = this.planning.programProgressPct;

  protected readonly libraryFilter = signal<ProtocolTag>('knee');

  protected readonly visibleProtocols = computed(() =>
    this.therapy.libraryProtocols().filter(p => p.tags.includes(this.libraryFilter()))
  );

  protected onLibraryFilter(tag: ProtocolTag) { this.libraryFilter.set(tag); }
  protected onAddProtocol() { console.log('Add protocol to routine'); }
  protected onSaveDraft() { console.log('Save draft'); }
  protected onFinalizeAndDeploy() { console.log('Finalize & deploy'); }

  protected onParamChange(event: ParamChangeEvent) {
    this.planning.adjustRoutineParam(event.exerciseId, event.paramKey, event.delta);
  }

  protected onRemoveExercise(exerciseId: number) {
    this.planning.removeRoutineExercise(exerciseId);
  }
}
