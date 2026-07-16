import { Component, computed, inject, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ThemeStore } from '../../../../shared/application/theme.store';

export interface TherapyChartSeries {
  label: string;
  values: (number | null)[];
  /** Resolved against the CSS custom properties of the active theme, e.g. `--p-primary-500`. */
  colorToken: string;
  /** Renders as a dashed reference line (a target, not a measurement). */
  dashed?: boolean;
  fill?: boolean;
}

/**
 * Thin wrapper over p-chart that keeps charts inside the design system and reacting to the theme.
 *
 * <p>Deliberately lives in `therapy/` rather than `shared/`: primeng/chart statically imports
 * `chart.js/auto`, which registers every controller (~200 kB, no tree-shaking). The therapy route is
 * lazy, so that weight lands in its own chunk. Promoting this to `shared/` invites the next chart on
 * an eager view to drag chart.js into the initial bundle, which is already near its budget.
 */
@Component({
  selector: 'app-therapy-chart',
  imports: [ChartModule],
  templateUrl: './therapy-chart.html',
  styleUrl: './therapy-chart.scss',
})
export class TherapyChart {
  readonly type = input<'line' | 'bar'>('line');
  readonly labels = input.required<string[]>();
  readonly series = input.required<TherapyChartSeries[]>();
  readonly yAxisSuffix = input('');
  readonly ariaLabel = input('');

  private readonly themeStore = inject(ThemeStore);

  /**
   * p-chart is OnPush over its `data`/`options` inputs, so these must be new objects on every theme
   * change — mutating in place would not repaint. Reading `themeStore.theme()` is what makes the
   * computed re-run once the `.app-dark` class (and with it the CSS variables) has flipped.
   */
  protected readonly data = computed(() => {
    this.themeStore.theme();
    return {
      labels: this.labels(),
      datasets: this.series().map((series) => {
        const color = this.cssValue(series.colorToken);
        return {
          label: series.label,
          data: series.values,
          borderColor: color,
          backgroundColor: series.fill ? this.alpha(color, 0.15) : color,
          borderDash: series.dashed ? [5, 4] : undefined,
          borderWidth: 2,
          fill: series.fill ?? false,
          tension: 0.3,
          pointRadius: series.dashed ? 0 : 3,
          pointHoverRadius: 5,
          spanGaps: true,
        };
      }),
    };
  });

  protected readonly options = computed(() => {
    this.themeStore.theme();
    const text = this.cssValue('--p-text-muted-color');
    const grid = this.cssValue('--p-content-border-color');
    const suffix = this.yAxisSuffix();

    return {
      maintainAspectRatio: false,
      responsive: true,
      interaction: { mode: 'index' as const, intersect: false },
      plugins: {
        legend: { labels: { color: text, boxWidth: 10, usePointStyle: true } },
        tooltip: {
          callbacks: {
            label: (context: { dataset: { label?: string }; parsed: { y: number | null } }) =>
              `${context.dataset.label}: ${context.parsed.y ?? '—'}${suffix}`,
          },
        },
      },
      scales: {
        x: { ticks: { color: text }, grid: { color: grid } },
        y: {
          ticks: { color: text, callback: (value: number | string) => `${value}${suffix}` },
          grid: { color: grid },
        },
      },
    };
  });

  private cssValue(token: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  }

  private alpha(color: string, amount: number): string {
    return `color-mix(in srgb, ${color} ${amount * 100}%, transparent)`;
  }
}
