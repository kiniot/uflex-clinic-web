import {DecimalPipe} from '@angular/common';
import {Component, computed, inject, signal, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {SelectModule} from 'primeng/select';
import {StatCard} from '../../../../shared/presentation/components/stat-card/stat-card';
import {OrganizationStore} from '../../../application/organization.store';
import {Patient} from '../../../domain/model/patient.entity';
import {TeamMember} from '../../../domain/model/team-member.entity';
import {PatientTable} from '../../components/patient-table/patient-table';
import {TeamMembersTable} from '../../components/team-members-table/team-members-table';

type OrgTab = 'physiotherapists' | 'patients';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-organization-management',
  imports: [DecimalPipe, FormsModule, RouterLink, TranslatePipe, ButtonModule, SelectModule, StatCard, TeamMembersTable, PatientTable],
  templateUrl: './organization-management.html',
  styleUrl: './organization-management.scss'
})
export class OrganizationManagement implements OnInit {
  protected readonly store = inject(OrganizationStore);

  protected readonly clinic = this.store.clinic;
  protected readonly teamMembers = this.store.teamMembers;
  protected readonly allPatients = this.store.allPatients;
  protected readonly fleetHealth = this.store.fleetHealthSnapshot;

  protected readonly activeTab = signal<OrgTab>('physiotherapists');
  protected readonly statusFilter = signal<string>('all');
  protected readonly patientStatusFilter = signal<string>('all');

  ngOnInit() {
    this.store.loadAll();
  }

  protected readonly physioStatusOptions: SelectOption<string>[] = [
    {label: 'All', value: 'all'},
    {label: 'Active', value: 'ACTIVE'},
    {label: 'Inactive', value: 'INACTIVE'},
    {label: 'Suspended', value: 'SUSPENDED'}
  ];

  protected readonly patientStatusOptions: SelectOption<string>[] = [
    {label: 'All', value: 'all'},
    {label: 'Unassigned', value: 'UNASSIGNED'},
    {label: 'In Treatment', value: 'IN_TREATMENT'},
    {label: 'Completed', value: 'COMPLETED'},
    {label: 'Discharged', value: 'DISCHARGED'}
  ];

  protected readonly visibleMembers = computed(() => {
    const filter = this.statusFilter();
    const list = this.teamMembers();
    if (filter === 'all') return list;
    return list.filter(m => m.status === filter);
  });

  protected readonly visiblePatients = computed(() => {
    const filter = this.patientStatusFilter();
    const list = this.allPatients();
    if (filter === 'all') return list;
    return list.filter(p => p.status === filter);
  });

  protected readonly availableKitsPct = computed(() => {
    const c = this.clinic();
    if (c.totalIotKits === 0) return 0;
    return Math.round((c.availableIotKits / c.totalIotKits) * 100);
  });

  protected onTab(tab: OrgTab) { this.activeTab.set(tab); }

  protected onMemberOpen(member: TeamMember) {
    console.log('Open member detail', member.fullName);
  }

  protected onPatientOpen(patient: Patient) {
    console.log('Open patient detail', patient.fullName);
  }

  protected onEditClinic() { console.log('Edit clinic profile'); }
}
