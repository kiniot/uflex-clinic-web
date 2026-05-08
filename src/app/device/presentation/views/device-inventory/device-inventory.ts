import {DecimalPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {DeviceStore} from '../../../application/device.store';
import {InventoryDevice} from '../../../domain/model/inventory-device.entity';

/**
 * Physiotherapist's Device view. Surfaces the fleet from the
 * clinician angle: connectivity counts, battery health buckets, and
 * the assignable inventory rows. Different from the clinic admin's
 * device-management view (which focuses on operational kit ops).
 */
@Component({
  selector: 'app-device-inventory',
  imports: [DecimalPipe, TranslatePipe, ButtonModule],
  templateUrl: './device-inventory.html',
  styleUrl: './device-inventory.scss'
})
export class DeviceInventory {
  private readonly store = inject(DeviceStore);

  protected readonly inventory = this.store.inventoryDevices;
  protected readonly inventoryTotal = this.store.inventoryTotal;
  protected readonly connectivity = this.store.fleetConnectivity;
  protected readonly batteryHealth = this.store.batteryHealth;
  protected readonly gateway = this.store.connectivityGateway;
  protected readonly availableUnitsPct = this.store.availableUnitsPct;

  protected onAssignToPatient() { console.log('Assign to patient'); }
  protected onFilter() { console.log('Filter inventory'); }
  protected onExport() { console.log('Export inventory'); }
  protected onRowAction(device: InventoryDevice) {
    console.log('Row action for', device.deviceId);
  }
  protected onChargingReport() { console.log('View charging report'); }
  protected onRequestService() { console.log('Request service'); }
  protected onAssignmentWizard() { console.log('Start assignment wizard'); }
}
