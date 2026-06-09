import {Component, computed, inject, signal} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {DeviceStore} from '../../../application/device.store';
import {Device} from '../../../domain/model/device.entity';
import {ConfirmActionDialog} from '../../../../shared/presentation/components/confirm-action-dialog/confirm-action-dialog';

@Component({
  selector: 'app-device-inventory',
  imports: [
    DatePipe,
    DecimalPipe,
    TranslatePipe,
    ButtonModule,
    ToastModule,
    RouterLink,
    ConfirmActionDialog
  ],
  providers: [MessageService],
  templateUrl: './device-inventory.html',
  styleUrl: './device-inventory.scss'
})
export class DeviceInventory {
  private readonly store = inject(DeviceStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);

  protected readonly devices = this.store.devices;
  protected readonly fleetMetrics = this.store.fleetMetrics;
  protected readonly syncedThisWeek = this.store.syncedThisWeek;
  protected readonly availableUnitsPct = this.store.availableUnitsPct;

  /* Battery health computed from real device data */
  protected readonly batteryHighCount = computed(() =>
    this.devices().filter(d => d.batteryLevel >= 80).length
  );
  protected readonly batteryMidCount = computed(() =>
    this.devices().filter(d => d.batteryLevel >= 20 && d.batteryLevel < 80).length
  );
  protected readonly batteryLowCount = computed(() => this.fleetMetrics().lowBattery);

  /* Gateway status derived from offline count */
  protected readonly gatewayStatus = computed(() => {
    const offline = this.fleetMetrics().offline;
    const total = this.fleetMetrics().total;
    if (total === 0) return 'stable';
    if (offline === total) return 'down';
    if (offline === 0) return 'stable';
    return 'degraded';
  });

  /* Confirm dialog state */
  protected readonly confirmDialogVisible = signal(false);
  protected readonly confirmDialogTitleKey = signal('');
  protected readonly confirmDialogMessageKey = signal('');
  protected readonly confirmDialogIconClass = signal('pi pi-question-circle');
  protected readonly confirmDialogTone = signal<'primary' | 'danger'>('primary');
  protected readonly confirmDialogActionLabelKey = signal('');
  protected readonly confirmDialogPending = signal(false);
  protected readonly selectedDeviceForAction = signal<Device | null>(null);

  /* Actions */

  protected onViewDetails(device: Device) {
    this.router.navigate(['details', device.serialNumber], {relativeTo: this.route});
  }

  protected onOpenDeleteConfirm(device: Device) {
    this.selectedDeviceForAction.set(device);
    this.confirmDialogTitleKey.set('deviceManagement.deleteConfirm.title');
    this.confirmDialogMessageKey.set('deviceManagement.deleteConfirm.body');
    this.confirmDialogIconClass.set('pi pi-trash');
    this.confirmDialogTone.set('danger');
    this.confirmDialogActionLabelKey.set('deviceManagement.actions.deleteDevice');
    this.confirmDialogVisible.set(true);
  }

  protected onConfirmAction() {
    const device = this.selectedDeviceForAction();
    if (!device) return;

    this.confirmDialogPending.set(true);
    this.store.deleteDevice(device.serialNumber).subscribe({
      next: () => {
        this.confirmDialogPending.set(false);
        this.confirmDialogVisible.set(false);
        this.messageService.add({severity: 'success', summary: 'Dispositivo eliminado', detail: `Dispositivo ${device.serialNumber} eliminado`});
      },
      error: () => {
        this.confirmDialogPending.set(false);
        this.confirmDialogVisible.set(false);
      }
    });
  }

  protected onCloseDialog() {
    this.confirmDialogVisible.set(false);
  }
}
