import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { OrganizationStore } from '../../../../organization/application/organization.store';
import { SearchInput } from '../../../../shared/presentation/components/search-input/search-input';
import { PlanningStore } from '../../../application/planning.store';
import { TreatmentPlan } from '../../../domain/model/treatment-plan.entity';

/** One table row: a treatment plan joined with its patient's display name. */
interface PlanningRow {
  plan: TreatmentPlan;
  patientId: string;
  patientName: string;
}

/**
 * Planning hub: every treatment plan across the physiotherapist's
 * caseload in one flat table (one row per plan). Identity and therapy
 * columns deliberately live in /physiotherapist/patients and /therapy;
 * this table stays plan-centric (plan, status, period, routines) so it
 * never repeats those.
 */
@Component({
  selector: 'app-planning-hub',
  imports: [DatePipe, TranslatePipe, ButtonModule, SearchInput],
  templateUrl: './planning-hub.html',
  styleUrl: './planning-hub.scss',
})
export class PlanningHub implements OnInit {
  private readonly router = inject(Router);
  private readonly planningStore = inject(PlanningStore);
  private readonly organizationStore = inject(OrganizationStore);

  protected readonly isLoading = this.planningStore.isLoadingAllTreatmentPlans;

  private readonly querySignal = signal('');
  protected readonly query = this.querySignal.asReadonly();

  private readonly patientNames = computed(() => {
    const map = new Map<string, string>();
    for (const patient of this.organizationStore.patients()) {
      map.set(patient.id, patient.fullName);
    }
    return map;
  });

  protected readonly rows = computed<PlanningRow[]>(() => {
    const names = this.patientNames();
    return this.planningStore.allTreatmentPlans().map((plan) => ({
      plan,
      patientId: plan.patientId,
      patientName: names.get(plan.patientId) ?? plan.patientId,
    }));
  });

  protected readonly filteredRows = computed<PlanningRow[]>(() => {
    const query = this.querySignal().trim().toLowerCase();
    if (!query) return this.rows();
    return this.rows().filter(
      (row) =>
        row.patientName.toLowerCase().includes(query) ||
        row.plan.name.toLowerCase().includes(query),
    );
  });

  protected readonly showSearch = computed(() => this.rows().length > 5);

  async ngOnInit(): Promise<void> {
    const physiotherapist = await this.organizationStore.loadCurrentPhysiotherapistOnce();
    await Promise.all([
      this.organizationStore.loadMyPatients(),
      this.planningStore.loadAllTreatmentPlans(
        physiotherapist ? { physiotherapistId: physiotherapist.id } : undefined,
      ),
    ]);
  }

  protected onOpenPlan(row: PlanningRow): void {
    void this.router.navigate([
      '/physiotherapist/planning',
      row.patientId,
      'treatment-plans',
      row.plan.id,
    ]);
  }

  protected onQueryChange(value: string): void {
    this.querySignal.set(value);
  }
}
