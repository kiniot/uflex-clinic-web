import {Component, computed, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {HardwareIntegrityLevel} from '../../../domain/model/calibration.types';

/**
 * Compact card showing the hardware integrity status of the device under
 * calibration. Maps the domain level to a colored badge.
 */
@Component({
  selector: 'app-hardware-integrity',
  imports: [TranslatePipe],
  templateUrl: './hardware-integrity.html',
  styleUrl: './hardware-integrity.scss'
})
export class HardwareIntegrity {
  level = input.required<HardwareIntegrityLevel>();

  protected levelKey = computed(() =>
    `deviceCalibration.integrity.${this.level()}`
  );
}
