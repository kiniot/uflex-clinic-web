import { Component, computed, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Patient } from '../../../../organization/domain/model/patient.entity';
import { SearchInput } from '../../../../shared/presentation/components/search-input/search-input';

/**
 * The clinician's patient list: who they are looking at, and who they could look at instead.
 *
 * <p>Kept as a component rather than markup inside the view so the search and the live marker live
 * in one place. Deliberately not wired into the clinic-admin therapy view, which renders its own
 * roster inline — adopting this there is a separate call.
 */
@Component({
  selector: 'app-patient-roster',
  imports: [TranslatePipe, SearchInput],
  templateUrl: './patient-roster.html',
  styleUrl: './patient-roster.scss',
})
export class PatientRoster {
  readonly patients = input.required<Patient[]>();
  readonly selectedPatientId = input<string | null>(null);
  readonly isLoading = input(false);
  /** Marks the one patient known to be mid-session; resolving this for every patient would cost a request each. */
  readonly patientIdInSession = input<string | null>(null);
  readonly selectPatient = output<Patient>();

  private readonly querySignal = signal('');

  protected readonly query = this.querySignal.asReadonly();

  protected readonly filteredPatients = computed(() => {
    const query = this.querySignal().trim().toLowerCase();
    if (!query) return this.patients();
    return this.patients().filter((patient) =>
      `${patient.fullName} ${patient.medicalCondition}`.toLowerCase().includes(query),
    );
  });

  /** The search box only earns its space once the list is long enough to scan. */
  protected readonly showSearch = computed(() => this.patients().length > 5);

  protected onQueryChange(value: string) {
    this.querySignal.set(value);
  }

  protected initials(patient: Patient): string {
    return `${patient.firstName.charAt(0)}${patient.lastName.charAt(0)}`.toUpperCase();
  }
}
