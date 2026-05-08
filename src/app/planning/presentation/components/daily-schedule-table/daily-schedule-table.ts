import {Component, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AvatarModule} from 'primeng/avatar';
import {Session} from '../../../domain/model/session.entity';

/**
 * Tabular view of a clinician's daily session schedule. Renders each
 * Session as a row (time, patient, focus area, IoT status pill, row
 * chevron) and emits {@link rowOpen} when the user picks one.
 */
@Component({
  selector: 'app-daily-schedule-table',
  imports: [TranslatePipe, AvatarModule],
  templateUrl: './daily-schedule-table.html',
  styleUrl: './daily-schedule-table.scss'
})
export class DailyScheduleTable {
  sessions = input.required<Session[]>();

  readonly rowOpen = output<Session>();

  protected onRowOpen(session: Session) {
    this.rowOpen.emit(session);
  }
}
