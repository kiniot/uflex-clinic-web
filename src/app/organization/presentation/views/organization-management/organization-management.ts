import {DecimalPipe} from '@angular/common';
import {Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {SelectModule} from 'primeng/select';
import {StatCard} from '../../../../shared/presentation/components/stat-card/stat-card';
import {OrganizationStore} from '../../../application/organization.store';
import {TeamMember} from '../../../domain/model/team-member.entity';
import {TeamMembersTable} from '../../components/team-members-table/team-members-table';

type OrgTab = 'physiotherapists' | 'patients';

interface SelectOption<T> {
  label: string;
  value: T;
}

/**
 * Organization view in the Organization bounded context. Renders the
 * clinic identity header, three KPI cards (patients, physiotherapists,
 * IoT kits), the staff tabs/table, and two summary cards at the bottom.
 */
@Component({
  selector: 'app-organization-management',
  imports: [DecimalPipe, FormsModule, RouterLink, TranslatePipe, ButtonModule, SelectModule, StatCard, TeamMembersTable],
  templateUrl: './organization-management.html',
  styleUrl: './organization-management.scss'
})
export class OrganizationManagement {
  private readonly store = inject(OrganizationStore);

  protected readonly clinic = this.store.clinic;
  protected readonly teamMembers = this.store.teamMembers;

  protected readonly activeTab = signal<OrgTab>('physiotherapists');
  protected readonly statusFilter = signal<string>('all');

  protected readonly statusOptions: SelectOption<string>[] = [
    {label: 'Status: All', value: 'all'},
    {label: 'Active', value: 'active'},
    {label: 'On Leave', value: 'on-leave'},
    {label: 'Inactive', value: 'inactive'}
  ];

  protected readonly visibleMembers = computed(() => {
    const filter = this.statusFilter();
    const list = this.teamMembers();
    if (filter === 'all') return list;
    return list.filter(m => m.status === filter);
  });

  protected readonly availableKitsPct = computed(() => {
    const c = this.clinic();
    if (c.totalIotKits === 0) return 0;
    return Math.round((c.availableIotKits / c.totalIotKits) * 100);
  });

  protected onTab(tab: OrgTab) { this.activeTab.set(tab); }

  protected onMemberOpen(member: TeamMember) {
    console.log('Open member detail', member.name);
  }

  protected onEditClinic() { console.log('Edit clinic profile'); }
}
