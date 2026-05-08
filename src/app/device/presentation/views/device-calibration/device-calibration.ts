import {Component, computed, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ButtonModule} from 'primeng/button';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {MOCK_CALIBRATION_SESSION} from '../../../infrastructure/calibration.mock';
import {CalibrationSteps} from '../../components/calibration-steps/calibration-steps';
import {HardwareIntegrity} from '../../components/hardware-integrity/hardware-integrity';
import {LiveAlignment} from '../../components/live-alignment/live-alignment';

/**
 * Device Calibration view in the Device bounded context. Renders the page
 * header, the live spatial alignment, the step list, the hardware integrity
 * badge, and the bottom telemetry tiles. Currently uses a static mock
 * session; once the backend exposes a calibration channel, the view will
 * subscribe to a live telemetry signal instead.
 */
@Component({
  selector: 'app-device-calibration',
  imports: [
    RouterLink,
    TranslatePipe,
    ButtonModule,
    PageHeader,
    LiveAlignment,
    CalibrationSteps,
    HardwareIntegrity
  ],
  templateUrl: './device-calibration.html',
  styleUrl: './device-calibration.scss'
})
export class DeviceCalibration {
  private translate = inject(TranslateService);
  private router = inject(Router);

  protected readonly session = MOCK_CALIBRATION_SESSION;

  private readonly subtitleStream = toSignal(
    this.translate.stream('deviceCalibration.subtitle', {
      sensor: this.session.sensorName,
      id: this.session.sensorId
    }),
    {initialValue: ''}
  );

  protected readonly subtitle = computed(() => this.subtitleStream());

  protected onRestartGuide() {
    console.log('Restart calibration guide');
  }

  protected onCompleteCalibration() {
    this.router.navigate(['/clinic-admin/device']);
  }
}
