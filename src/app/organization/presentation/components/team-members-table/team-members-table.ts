import {Component, computed, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AvatarModule} from 'primeng/avatar';
import {TeamMember} from '../../../domain/model/team-member.entity';

/**
 * Tabular view of clinic staff. Renders one row per team member with the
 * columns shown in the organization mockup (member, specialized role,
 * active patients with progress, status, row chevron).
 */
@Component({
  selector: 'app-team-members-table',
  imports: [TranslatePipe, AvatarModule],
  templateUrl: './team-members-table.html',
  styleUrl: './team-members-table.scss'
})
export class TeamMembersTable {
  members = input.required<TeamMember[]>();
  /** Largest activePatients across all members; used to size the bar. */
  capacity = input<number>(40);

  readonly rowOpen = output<TeamMember>();

  protected scaledCapacity = computed(() => Math.max(this.capacity(), 1));

  protected progressFor(value: number): number {
    return Math.min(100, Math.round((value / this.scaledCapacity()) * 100));
  }

  protected onRowOpen(member: TeamMember) {
    this.rowOpen.emit(member);
  }
}
