import {Injectable, signal} from '@angular/core';
import {Clinic} from '../domain/model/clinic.entity';
import {TeamMember} from '../domain/model/team-member.entity';
import {MOCK_CLINIC, MOCK_TEAM_MEMBERS} from '../infrastructure/organization.mock';

/**
 * Application-layer store for the Organization bounded context. Holds the
 * current clinic and its team members as signals. Hydrated from a mock
 * today; once the Organization API is wired it will fetch the active
 * clinic for the signed-in user.
 */
@Injectable({providedIn: 'root'})
export class OrganizationStore {
  private readonly clinicSignal = signal<Clinic>(MOCK_CLINIC);
  private readonly teamMembersSignal = signal<TeamMember[]>(MOCK_TEAM_MEMBERS);

  readonly clinic = this.clinicSignal.asReadonly();
  readonly teamMembers = this.teamMembersSignal.asReadonly();
}
