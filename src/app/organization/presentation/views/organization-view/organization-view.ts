import {Component, computed, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {OrganizationStore} from '../../../application/organization.store';
import {StaffClinician} from '../../../domain/model/staff-clinician.entity';
import {UnassignedPatient} from '../../../domain/model/unassigned-patient.entity';

/**
 * Physiotherapist's Organization view. Surfaces the unassigned-patient
 * queue (left column) alongside a staff directory with caseload
 * progress and two summary KPIs (right column). Distinct from the
 * clinic admin's organization-management view.
 */
@Component({
  selector: 'app-organization-view',
  imports: [TranslatePipe, AvatarModule, ButtonModule],
  templateUrl: './organization-view.html',
  styleUrl: './organization-view.scss'
})
export class OrganizationView {
  private readonly store = inject(OrganizationStore);

  protected readonly unassigned = this.store.unassignedPatients;
  protected readonly unassignedTotal = this.store.unassignedTotal;
  protected readonly staff = this.store.staffDirectory;
  protected readonly summary = this.store.staffSummary;
  protected readonly fleet = this.store.fleetHealthSnapshot;
  protected readonly efficiency = this.store.clinicEfficiency;

  protected readonly capacity = computed(() => {
    const list = this.staff();
    if (list.length === 0) return 1;
    return Math.max(...list.map(s => s.caseloadMax));
  });

  protected onAssignSelf(patient: UnassignedPatient) {
    console.log('Assign to self', patient.name);
  }

  protected onFilter() { console.log('Filter staff'); }
  protected onExport() { console.log('Export report'); }
  protected onTriageHelp() { console.log('Open triage help'); }
  protected onEfficiencyReport() { console.log('Open efficiency report'); }

  protected onClinicianOpen(clinician: StaffClinician) {
    console.log('Open clinician', clinician.name);
  }

  protected caseloadPct(current: number, max: number): number {
    if (max === 0) return 0;
    return Math.round((current / max) * 100);
  }
}
