import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {StatCard} from '../../../../shared/presentation/components/stat-card/stat-card';
import {DeviceStore} from '../../../application/device.store';
import {Device} from '../../../domain/model/device.entity';
import {FleetTable} from '../../components/fleet-table/fleet-table';

/**
 * Device Inventory view in the Device bounded context. Renders the page
 * header with action buttons (run diagnostics, calibrate, link to patient,
 * register device), three stat cards, and the fleet status table.
 */
@Component({
  selector: 'app-device-management',
  imports: [RouterLink, TranslatePipe, ButtonModule, PageHeader, StatCard, FleetTable],
  templateUrl: './device-management.html',
  styleUrl: './device-management.scss'
})
export class DeviceManagement {
  private readonly store = inject(DeviceStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly devices = this.store.devices;
  protected readonly totalActiveKits = this.store.totalActiveKits;
  protected readonly requiresCalibration = this.store.requiresCalibration;
  protected readonly onlinePercentage = this.store.onlinePercentage;

  protected onRowAction(device: Device) {
    this.router.navigate(['details', device.id], {relativeTo: this.route});
  }
}
