import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-forbidden',
  imports: [TranslatePipe, ButtonModule],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.scss',
})
export class Forbidden {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);

  protected readonly actionTarget = computed(
    () => this.iamStore.currentPortalLandingRoute() ?? '/sign-in',
  );
  protected readonly actionLabelKey = computed(() =>
    this.iamStore.hasPortalAccess() ? 'forbidden.go-portal' : 'forbidden.go-sign-in',
  );

  protected navigateToPrimaryAction() {
    this.router.navigate([this.actionTarget()]).then();
  }
}
