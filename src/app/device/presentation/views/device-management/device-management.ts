import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeader } from '../../../../shared/presentation/components/page-header/page-header';
import { StatCard } from '../../../../shared/presentation/components/stat-card/stat-card';
import { DeviceStore } from '../../../application/device.store';
import { Device } from '../../../domain/model/device.entity';
import { FleetTable } from '../../components/fleet-table/fleet-table';

@Component({
  selector: 'app-device-management',
  imports: [TranslatePipe, PageHeader, StatCard, FleetTable],
  templateUrl: './device-management.html',
  styleUrl: './device-management.scss',
})
export class DeviceManagement {
  private readonly store = inject(DeviceStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly devices = this.store.devices;
  protected readonly fleetMetrics = this.store.fleetMetrics;
  protected readonly seenThisWeek = this.store.syncedThisWeek;

  protected onViewDetails(device: Device) {
    this.router.navigate(['details', device.id], { relativeTo: this.route });
  }
}
