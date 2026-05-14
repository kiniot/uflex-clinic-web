import {Component, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Patient} from '../../../domain/model/patient.entity';

@Component({
  selector: 'app-patient-table',
  imports: [TranslatePipe],
  templateUrl: './patient-table.html',
  styleUrl: './patient-table.scss'
})
export class PatientTable {
  patients = input.required<Patient[]>();
  readonly rowOpen = output<Patient>();

  protected onRowOpen(patient: Patient) {
    this.rowOpen.emit(patient);
  }

  protected getTreatmentPlan(treatmentPlanId: string | undefined): string {
    return treatmentPlanId ?? '';
  }
}