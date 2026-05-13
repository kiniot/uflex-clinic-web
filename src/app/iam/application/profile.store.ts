import {Injectable, signal} from '@angular/core';
import {UserProfile} from '../domain/model/user-profile.entity';
import {MOCK_TOTAL_ACTIVE_USERS, MOCK_USER_PROFILES} from '../infrastructure/user-profile.mock';

/**
 * Application-layer store for IAM user-directory data. Holds the visible
 * page of user profiles plus the total active-user count rendered in the
 * Profile management view. Hydrated from a mock today; will subscribe to
 * a paginated /users endpoint once the backend exposes one.
 */
@Injectable({providedIn: 'root'})
export class ProfileStore {
  private readonly userProfilesSignal = signal<UserProfile[]>(MOCK_USER_PROFILES);
  private readonly totalActiveUsersSignal = signal<number>(MOCK_TOTAL_ACTIVE_USERS);

  readonly userProfiles = this.userProfilesSignal.asReadonly();
  readonly totalActiveUsers = this.totalActiveUsersSignal.asReadonly();
}
