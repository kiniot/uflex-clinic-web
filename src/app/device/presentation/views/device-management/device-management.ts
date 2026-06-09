import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {StatCard} from '../../../../shared/presentation/components/stat-card/stat-card';
import {ConfirmActionDialog} from '../../../../shared/presentation/components/confirm-action-dialog/confirm-action-dialog';
import {DeviceStore} from '../../../application/device.store';
import {Device} from '../../../domain/model/device.entity';
import {FleetTable} from '../../components/fleet-table/fleet-table';

@Component({
  selector: 'app-device-management',
  imports: [RouterLink, TranslatePipe, ButtonModule, PageHeader, StatCard, FleetTable, ConfirmActionDialog],
  templateUrl: './device-management.html',
  styleUrl: './device-management.scss'
})
export class DeviceManagement {
  private readonly store = inject(DeviceStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly devices = this.store.devices;
  protected readonly fleetMetrics = this.store.fleetMetrics;
  protected readonly syncedThisWeek = this.store.syncedThisWeek;

  protected readonly confirmDialogVisible = signal(false);
  protected readonly confirmDialogTitleKey = signal('');
  protected readonly confirmDialogMessageKey = signal('');
  protected readonly confirmDialogIconClass = signal('pi pi-question-circle');
  protected readonly confirmDialogTone = signal<'primary' | 'danger'>('primary');
  protected readonly confirmDialogActionLabelKey = signal('');
  protected readonly selectedDeviceForAction = signal<Device | null>(null);
  protected readonly pendingAction = signal(false);

  protected onViewDetails(device: Device) {
    this.router.navigate(['details', device.serialNumber], {relativeTo: this.route});
  }

  protected onDeleteDevice(device: Device) {
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

    this.pendingAction.set(true);
    this.store.deleteDevice(device.serialNumber).subscribe({
      next: () => {
        this.pendingAction.set(false);
        this.closeDialog();
      },
      error: () => {
        this.pendingAction.set(false);
        this.closeDialog();
      }
    });
  }

  protected onCloseDialog() {
    this.closeDialog();
  }

  private closeDialog() {
    this.confirmDialogVisible.set(false);
    this.selectedDeviceForAction.set(null);
  }
}
