import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {StatCard} from '../../../../shared/presentation/components/stat-card/stat-card';
import {MOCK_DIAGNOSTIC_SESSION} from '../../../infrastructure/diagnostics.mock';
import {DiagnosticLog} from '../../components/diagnostic-log/diagnostic-log';
import {DiagnosticProgress} from '../../components/diagnostic-progress/diagnostic-progress';
import {HardwareIdCard} from '../../components/hardware-id-card/hardware-id-card';

/**
 * System Diagnostics view in the Device bounded context. Composes the
 * live scan progress, the hardware identity card, three stat tiles
 * (battery / signal / temperature), and the terminal log. The session is
 * mocked for now; swap to a streamed telemetry signal when the backend
 * exposes the diagnostic channel.
 */
@Component({
  selector: 'app-device-diagnostics',
  imports: [
    RouterLink,
    TranslatePipe,
    ButtonModule,
    StatCard,
    DiagnosticProgress,
    HardwareIdCard,
    DiagnosticLog
  ],
  templateUrl: './device-diagnostics.html',
  styleUrl: './device-diagnostics.scss'
})
export class DeviceDiagnostics {
  private router = inject(Router);

  protected readonly session = MOCK_DIAGNOSTIC_SESSION;
  protected readonly logs = signal(MOCK_DIAGNOSTIC_SESSION.logs);

  protected onClearLogs() {
    this.logs.set([]);
  }

  protected onRecalibrate() {
    this.router.navigate(['/clinic-admin/device/calibrate']);
  }

  protected onExportReport() {
    console.log('Export diagnostics report');
  }
}
