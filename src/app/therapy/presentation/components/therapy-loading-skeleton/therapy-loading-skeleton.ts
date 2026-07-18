import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Loading placeholder for the therapy index and a patient's detail: a KPI strip and a table of
 * rows, shaped like the real content so the page does not reflow when data lands.
 *
 * <p>It also stands in for the KPIs on purpose — until data arrives those derive from an empty list
 * and would otherwise flash four zeros, which read as real (wrong) figures.
 */
@Component({
  selector: 'app-therapy-loading-skeleton',
  imports: [TranslatePipe],
  templateUrl: './therapy-loading-skeleton.html',
  styleUrl: './therapy-loading-skeleton.scss',
})
export class TherapyLoadingSkeleton {
  /** i18n keys for the real card header, shown immediately so the section keeps its context. */
  readonly titleKey = input.required<string>();
  readonly subtitleKey = input.required<string>();
  readonly rows = input(6);
  /** The index lists patients (with an avatar); the detail lists sessions (without). */
  readonly withAvatar = input(false);
  readonly loadingLabelKey = input('therapySessions.loadingPatients');

  protected readonly tiles = [0, 1, 2, 3];
  protected readonly rowList = computed(() =>
    Array.from({ length: this.rows() }, (_, index) => index),
  );
}
