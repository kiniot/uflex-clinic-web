import { Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Patient } from '../../../domain/model/patient.entity';
import { PhysiotherapistProfile } from '../../../domain/model/physiotherapist-profile.entity';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-patient-assignment-dialog',
  imports: [FormsModule, TranslatePipe, ButtonModule, DialogModule, SelectModule],
  templateUrl: './patient-assignment-dialog.html',
  styleUrl: './patient-assignment-dialog.scss',
})
export class PatientAssignmentDialog {
  visible = input(false);
  patient = input<Patient | null>(null);
  physiotherapists = input<PhysiotherapistProfile[]>([]);
  selectedPhysiotherapistId = input<string | null>(null);
  isSaving = input(false);

  readonly visibleChange = output<boolean>();
  readonly selectedPhysiotherapistIdChange = output<string | null>();
  readonly save = output<void>();

  private readonly translate = inject(TranslateService);

  protected readonly assignmentOptions = computed<SelectOption<string | null>[]>(() => [
    {
      label: this.translate.instant('organization.assignment.keepUnassigned'),
      value: null,
    },
    ...this.physiotherapists().map((physiotherapist) => ({
      label: physiotherapist.fullName,
      value: physiotherapist.id,
    })),
  ]);

  protected onVisibleChange(visible: boolean) {
    this.visibleChange.emit(visible);
  }

  protected onSelectionChange(value: string | null) {
    this.selectedPhysiotherapistIdChange.emit(value);
  }

  protected onSave() {
    this.save.emit();
  }
}
