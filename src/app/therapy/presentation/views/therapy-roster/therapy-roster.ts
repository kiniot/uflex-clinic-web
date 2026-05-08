import {Component, computed, inject, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {TherapyStore} from '../../../application/therapy.store';
import {TherapyPatient} from '../../../domain/model/therapy-patient.entity';
import {TherapyRosterTable} from '../../components/therapy-roster-table/therapy-roster-table';

type RosterTab = 'all' | 'connected';

/**
 * Physiotherapist's Therapy view: KPI cards summarizing the clinic's
 * throughput plus the patient roster they actively review. Distinct
 * from the clinic admin's exercise catalog (TherapyManagement) — both
 * live in the Therapy bounded context but serve different roles.
 */
@Component({
  selector: 'app-therapy-roster',
  imports: [TranslatePipe, ButtonModule, TherapyRosterTable],
  templateUrl: './therapy-roster.html',
  styleUrl: './therapy-roster.scss'
})
export class TherapyRoster {
  private readonly store = inject(TherapyStore);

  protected readonly overview = this.store.overview;
  protected readonly devicesUsagePct = this.store.devicesUsagePct;
  protected readonly connectedCount = this.store.connectedPatientsCount;

  protected readonly activeTab = signal<RosterTab>('all');

  protected readonly visiblePatients = computed(() => {
    const list = this.store.patients();
    return this.activeTab() === 'connected'
      ? list.filter(p => p.iotStatus === 'connected')
      : list;
  });

  protected onTab(tab: RosterTab) { this.activeTab.set(tab); }

  protected onRegisterPatient() { console.log('Register new patient'); }
  protected onExploreSensors() { console.log('Explore sensor kits'); }
  protected onCreateTemplate() { console.log('Create new therapy template'); }
  protected onAddPatient() { console.log('Add patient FAB'); }

  protected onReviewTherapy(patient: TherapyPatient) {
    console.log('Review therapy for', patient.name);
  }
}
