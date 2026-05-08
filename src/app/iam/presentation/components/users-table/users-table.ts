import {Component, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AvatarModule} from 'primeng/avatar';
import {UserProfile} from '../../../domain/model/user-profile.entity';

/**
 * Tabular view of managed users for the Profile directory. Renders one
 * row per UserProfile with the columns shown in the mockup: identity
 * (avatar/name/email), role tag, status pill, verification badge, last
 * login, and per-row action menu.
 */
@Component({
  selector: 'app-users-table',
  imports: [TranslatePipe, AvatarModule],
  templateUrl: './users-table.html',
  styleUrl: './users-table.scss'
})
export class UsersTable {
  users = input.required<UserProfile[]>();

  readonly rowOpen = output<UserProfile>();
  readonly rowAction = output<UserProfile>();

  protected onRowOpen(user: UserProfile) {
    this.rowOpen.emit(user);
  }

  protected onRowAction(event: MouseEvent, user: UserProfile) {
    event.stopPropagation();
    this.rowAction.emit(user);
  }
}
