import {Component, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Device} from '../../../domain/model/device.entity';

/**
 * Tabular view of the device fleet. Renders one row per device with the
 * key columns shown in the inventory mockup (kit id, linked patient,
 * battery, bluetooth, calibration, firmware, status, actions).
 */
@Component({
  selector: 'app-fleet-table',
  imports: [TranslatePipe],
  templateUrl: './fleet-table.html',
  styleUrl: './fleet-table.scss'
})
export class FleetTable {
  devices = input.required<Device[]>();

  readonly rowAction = output<Device>();

  protected batteryLevelClass(level: number): string {
    if (level <= 20) return 'fleet-battery--low';
    if (level <= 50) return 'fleet-battery--medium';
    return 'fleet-battery--high';
  }

  protected onRowAction(device: Device, event: Event) {
    event.stopPropagation();
    this.rowAction.emit(device);
  }
}
