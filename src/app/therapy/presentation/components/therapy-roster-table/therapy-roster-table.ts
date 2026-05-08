import {Component, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AvatarModule} from 'primeng/avatar';
import {TherapyPatient} from '../../../domain/model/therapy-patient.entity';

/**
 * Tabular view of the therapy patient roster. Renders one row per
 * TherapyPatient with the columns shown in the mockup: identity,
 * injury context, last session, IoT status pill, and a Review Therapy
 * affordance. Emits {@link reviewOpen} when the action is invoked.
 */
@Component({
  selector: 'app-therapy-roster-table',
  imports: [TranslatePipe, AvatarModule],
  templateUrl: './therapy-roster-table.html',
  styleUrl: './therapy-roster-table.scss'
})
export class TherapyRosterTable {
  patients = input.required<TherapyPatient[]>();

  readonly reviewOpen = output<TherapyPatient>();

  protected onReview(event: MouseEvent, patient: TherapyPatient) {
    event.stopPropagation();
    this.reviewOpen.emit(patient);
  }
}
