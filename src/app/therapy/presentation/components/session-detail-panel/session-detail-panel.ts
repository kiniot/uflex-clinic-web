import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ExerciseCatalogItem } from '../../../../planning/domain/model/exercise-catalog-item.entity';
import {
  CompletedRepetitionResource,
  SerieExecutionResource,
  TherapySessionDetailResource,
} from '../../../infrastructure/therapy-session.response';
import { TherapyChart, TherapyChartSeries } from '../therapy-chart/therapy-chart';

/**
 * One session, series by series, down to each repetition the edge detected.
 *
 * <p>The repetitions are the reason this panel exists: `peakAngle`, `achievedRom` and the
 * classification have always been recorded, but no API ever exposed them, so a clinician could
 * never ask *why* a session went badly — only that it did.
 */
@Component({
  selector: 'app-session-detail-panel',
  imports: [TranslatePipe, DatePipe, TherapyChart],
  templateUrl: './session-detail-panel.html',
  styleUrl: './session-detail-panel.scss',
})
export class SessionDetailPanel {
  readonly detail = input.required<TherapySessionDetailResource>();
  readonly exerciseCatalog = input.required<ExerciseCatalogItem[]>();

  private readonly translateService = inject(TranslateService);

  /**
   * X axis is the repetition index, not time: `recordedAt` is a zoneless LocalDateTime from the
   * edge while the session's own timestamps are Instants, so a shared time axis would drift
   * silently. Cadence is not the question here anyway — the shape of the effort is.
   */
  protected repetitionLabels(serie: SerieExecutionResource): string[] {
    return serie.repetitions.map((_, index) => `${index + 1}`);
  }

  protected repetitionSeries(serie: SerieExecutionResource): TherapyChartSeries[] {
    const series: TherapyChartSeries[] = [
      {
        label: this.translateService.instant('therapySessions.tracking.chart.achievedRom'),
        values: serie.repetitions.map((repetition) => repetition.achievedRom),
        colorToken: '--p-primary-500',
      },
    ];
    if (serie.targetRom !== null) {
      series.push({
        label: this.translateService.instant('therapySessions.tracking.chart.targetRom'),
        values: serie.repetitions.map(() => serie.targetRom),
        colorToken: '--p-text-muted-color',
        dashed: true,
      });
    }
    return series;
  }

  protected serieTitle(serie: SerieExecutionResource, index: number): string {
    const exercise = this.exerciseCatalog().find((item) => item.id === serie.exerciseId);
    return exercise?.name ?? `${index + 1}`;
  }

  protected serieStatusKey(serie: SerieExecutionResource): string {
    return `therapySessions.statuses.serie.${serie.status ?? 'Unknown'}`;
  }

  protected sessionStatusKey(): string {
    return `therapySessions.statuses.session.${this.detail().status ?? 'Unknown'}`;
  }

  protected romLabel(value: number | null): string {
    return value !== null ? `${value.toFixed(1)}°` : '—';
  }

  /**
   * How far past the target a repetition reached. The edge flags overshoot as Unsafe, so a positive
   * delta on an Unsafe rep is the actual finding.
   */
  protected romDelta(repetition: CompletedRepetitionResource, serie: SerieExecutionResource): string {
    if (repetition.achievedRom === null || serie.targetRom === null) return '';
    const delta = repetition.achievedRom - serie.targetRom;
    return `${delta >= 0 ? '+' : ''}${delta.toFixed(0)}°`;
  }

  protected isOvershoot(repetition: CompletedRepetitionResource, serie: SerieExecutionResource): boolean {
    if (repetition.achievedRom === null || serie.targetRom === null) return false;
    return repetition.achievedRom > serie.targetRom;
  }
}
