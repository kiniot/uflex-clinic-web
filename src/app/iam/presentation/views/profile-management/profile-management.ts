import {DecimalPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {StatCard} from '../../../../shared/presentation/components/stat-card/stat-card';
import {ProfileStore} from '../../../application/profile.store';
import {UserProfile} from '../../../domain/model/user-profile.entity';
import {UsersTable} from '../../components/users-table/users-table';

/**
 * Profile management view in the IAM bounded context. Renders four
 * action/metric cards plus a paginated user-directory table with an
 * invite action.
 */
@Component({
  selector: 'app-profile-management',
  imports: [DecimalPipe, TranslatePipe, ButtonModule, PageHeader, StatCard, UsersTable],
  templateUrl: './profile-management.html',
  styleUrl: './profile-management.scss'
})
export class ProfileManagement {
  private readonly store = inject(ProfileStore);

  protected readonly users = this.store.userProfiles;
  protected readonly totalActiveUsers = this.store.totalActiveUsers;

  protected onFilter() { console.log('Open filter panel'); }
  protected onInvite() { console.log('Invite user'); }

  protected onRowOpen(user: UserProfile) {
    console.log('Open user detail', user.email);
  }

  protected onRowAction(user: UserProfile) {
    console.log('Row action menu', user.email);
  }
}
