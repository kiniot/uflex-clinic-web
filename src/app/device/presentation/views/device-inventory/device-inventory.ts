import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DeviceStore } from '../../../application/device.store';
import { OrganizationStore } from '../../../../organization/application/organization.store';
import { Device } from '../../../domain/model/device.entity';

type InventoryTab = 'available' | 'myDevices';

@Component({
  selector: 'app-device-inventory',
  imports: [DatePipe, DecimalPipe, TranslatePipe, ButtonModule, TooltipModule],
  templateUrl: './device-inventory.html',
  styleUrl: './device-inventory.scss',
})
export class DeviceInventory {
  private readonly store = inject(DeviceStore);
  private readonly orgStore = inject(OrganizationStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly devices = this.store.devices;

  /* Tab state */
  protected readonly activeTab = signal<InventoryTab>('available');
  private readonly myPatientIds = computed(
    () => new Set(this.orgStore.patients().map((p) => p.id)),
  );

  protected readonly filteredDevices = computed(() => {
    const tab = this.activeTab();
    const all = this.devices();

    if (tab === 'available') {
      return all.filter((d) => d.status === 'AVAILABLE');
    }

    const ids = this.myPatientIds();
    return all.filter((d) => d.currentPatientId != null && ids.has(d.currentPatientId));
  });

  /* Metrics scoped to the physiotherapist's patients */
  protected readonly myPatientDevices = computed(() =>
    this.devices().filter(
      (d) => d.currentPatientId != null && this.myPatientIds().has(d.currentPatientId),
    ),
  );

  protected readonly myPatientOnlineCount = computed(
    () => this.myPatientDevices().filter((d) => !d.offline).length,
  );

  protected readonly myPatientOnlinePct = computed(() => {
    const total = this.myPatientDevices().length;
    if (total === 0) return 0;
    return Math.round((this.myPatientOnlineCount() / total) * 100);
  });

  protected readonly myPatientInMaintenance = computed(
    () => this.myPatientDevices().filter((d) => d.status === 'IN_MAINTENANCE').length,
  );

  protected readonly myPatientSeenThisWeek = computed(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.myPatientDevices().filter((d) => d.lastSeenAt && d.lastSeenAt >= weekAgo).length;
  });

  /* Battery health scoped to the physiotherapist's patients */
  protected readonly myPatientBatteryHighCount = computed(
    () => this.myPatientDevices().filter((d) => d.batteryLevel >= 80).length,
  );

  protected readonly myPatientBatteryMidCount = computed(
    () => this.myPatientDevices().filter((d) => d.batteryLevel >= 20 && d.batteryLevel < 80).length,
  );

  protected readonly myPatientBatteryLowCount = computed(
    () => this.myPatientDevices().filter((d) => d.batteryLevel < 20).length,
  );

  constructor() {
    void this.orgStore.loadMyPatients();
  }

  protected setActiveTab(tab: InventoryTab) {
    this.activeTab.set(tab);
  }

  /* Actions */

  protected onViewDetails(device: Device) {
    this.router.navigate(['details', device.id], { relativeTo: this.route });
  }
}
