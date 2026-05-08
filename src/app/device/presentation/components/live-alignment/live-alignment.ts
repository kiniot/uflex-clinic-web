import {Component, computed, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Visual representation of the device's spatial alignment during
 * calibration: a dotted reference circle with the device core rotated
 * to reflect the current pitch/roll, plus the three axis readouts.
 */
@Component({
  selector: 'app-live-alignment',
  imports: [TranslatePipe],
  templateUrl: './live-alignment.html',
  styleUrl: './live-alignment.scss'
})
export class LiveAlignment {
  pitchDeg = input.required<number>();
  yawDeg = input.required<number>();
  rollDeg = input.required<number>();

  /**
   * The visual rotation applied to the core element. We use a clamped
   * combination of pitch and roll so the box leans toward whichever axis
   * is most off-axis without ever going past ±45°.
   */
  protected coreRotation = computed(() => {
    const tilt = (this.pitchDeg() + this.rollDeg()) * 4;
    return Math.max(-45, Math.min(45, tilt));
  });

  protected formatDeg(value: number): string {
    const sign = value > 0 ? '+' : value < 0 ? '' : '+';
    return `${sign}${value.toFixed(2)}°`;
  }
}
