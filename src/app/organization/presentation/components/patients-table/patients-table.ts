import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Patient } from '../../../domain/model/patient.entity';

@Component({
  selector: 'app-patients-table',
  imports: [TranslatePipe, ButtonModule],
  templateUrl: './patients-table.html',
  styleUrl: './patients-table.scss',
})
export class PatientsTable {
  patients = input.required<Patient[]>();
  physiotherapistNames = input<Record<string, string>>({});

  readonly rowOpen = output<Patient>();
  readonly assign = output<Patient>();

  protected onRowOpen(patient: Patient) {
    this.rowOpen.emit(patient);
  }

  protected onAssign(patient: Patient) {
    this.assign.emit(patient);
  }

  protected assignedLabel(patient: Patient): string | null {
    const assignedPhysiotherapistId = patient.assignedPhysiotherapistId;
    if (!assignedPhysiotherapistId) return null;
    return this.physiotherapistNames()[assignedPhysiotherapistId] ?? assignedPhysiotherapistId;
  }
}
