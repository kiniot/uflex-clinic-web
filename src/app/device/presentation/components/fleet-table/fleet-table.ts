import {Component, computed, inject, input, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {SelectModule} from 'primeng/select';
import {TooltipModule} from 'primeng/tooltip';
import {Device} from '../../../domain/model/device.entity';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-fleet-table',
  imports: [FormsModule, TranslatePipe, SelectModule, ButtonModule, TooltipModule],
  templateUrl: './fleet-table.html',
  styleUrl: './fleet-table.scss'
})
export class FleetTable {
  private translate = inject(TranslateService);

  devices = input.required<Device[]>();

  readonly viewDetails = output<Device>();
  readonly deleteDevice = output<Device>();

  protected readonly connectivityFilter = signal<'all' | 'online' | 'offline'>('all');
  protected readonly calibrationFilter = signal<'all' | 'VALID' | 'NEEDS_CALIBRATION'>('all');
  protected readonly statusFilter = signal<'all' | 'AVAILABLE' | 'ASSIGNED' | 'IN_MAINTENANCE' | 'RETIRED'>('all');

  private readonly filterLabels = toSignal(
    this.translate.stream([
      'deviceManagement.filters.all',
      'deviceManagement.filters.allCalibration',
      'deviceManagement.filters.allStatus',
      'deviceManagement.status.online',
      'deviceManagement.status.offline',
      'deviceManagement.calibration.valid',
      'deviceManagement.calibration.expired',
      'deviceManagement.status.AVAILABLE',
      'deviceManagement.status.ASSIGNED',
      'deviceManagement.status.IN_MAINTENANCE',
      'deviceManagement.status.RETIRED'
    ]),
    {initialValue: {} as Record<string, string>}
  );

  protected readonly connectivityOptions = computed<SelectOption<string>[]>(() => [
    {label: this.filterLabels()['deviceManagement.filters.all'] ?? 'All', value: 'all'},
    {label: this.filterLabels()['deviceManagement.status.online'] ?? 'Online', value: 'online'},
    {label: this.filterLabels()['deviceManagement.status.offline'] ?? 'Offline', value: 'offline'},
  ]);

  protected readonly calibrationOptions = computed<SelectOption<string>[]>(() => [
    {label: this.filterLabels()['deviceManagement.filters.allCalibration'] ?? 'All', value: 'all'},
    {label: this.filterLabels()['deviceManagement.calibration.valid'] ?? 'Valid', value: 'VALID'},
    {label: this.filterLabels()['deviceManagement.calibration.expired'] ?? 'Expired', value: 'NEEDS_CALIBRATION'},
  ]);

  protected readonly statusOptions = computed<SelectOption<string>[]>(() => [
    {label: this.filterLabels()['deviceManagement.filters.allStatus'] ?? 'All', value: 'all'},
    {label: this.filterLabels()['deviceManagement.status.AVAILABLE'] ?? 'Available', value: 'AVAILABLE'},
    {label: this.filterLabels()['deviceManagement.status.ASSIGNED'] ?? 'Assigned', value: 'ASSIGNED'},
    {label: this.filterLabels()['deviceManagement.status.IN_MAINTENANCE'] ?? 'In Maintenance', value: 'IN_MAINTENANCE'},
    {label: this.filterLabels()['deviceManagement.status.RETIRED'] ?? 'Retired', value: 'RETIRED'},
  ]);

  protected readonly filteredDevices = computed(() => {
    const connectivity = this.connectivityFilter();
    const calibration = this.calibrationFilter();
    const status = this.statusFilter();

    return this.devices().filter(device => {
      if (connectivity !== 'all') {
        const isOnline = !device.offline;
        if (connectivity === 'online' && !isOnline) return false;
        if (connectivity === 'offline' && isOnline) return false;
      }
      if (calibration !== 'all' && device.calibrationStatus !== calibration) return false;
      if (status !== 'all' && device.status !== status) return false;
      return true;
    });
  });

  protected batteryLevelClass(level: number): string {
    if (level <= 20) return 'fleet-battery--low';
    if (level <= 50) return 'fleet-battery--medium';
    return 'fleet-battery--high';
  }

  protected onViewDetails(device: Device, event: Event) {
    event.stopPropagation();
    this.viewDetails.emit(device);
  }

  protected onDeleteDevice(device: Device, event: Event) {
    event.stopPropagation();
    this.deleteDevice.emit(device);
  }
}
