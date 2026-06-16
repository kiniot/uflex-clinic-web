import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-page-not-found',
  imports: [TranslatePipe, ButtonModule],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss',
})
export class PageNotFound implements OnInit {
  protected invalidPath: string = '';
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private iamStore = inject(IamStore);

  protected readonly hasPortalAccess = computed(() => this.iamStore.hasPortalAccess());
  protected readonly actionTarget = computed(
    () => this.iamStore.currentPortalLandingRoute() ?? '/sign-in',
  );
  protected readonly actionLabelKey = computed(() =>
    this.hasPortalAccess() ? 'page-not-found.go-portal' : 'page-not-found.go-sign-in',
  );
  protected readonly displayPath = computed(() => this.invalidPath || '/');

  ngOnInit() {
    this.invalidPath = this.route.snapshot.url.map((url) => url.path).join('/');
  }

  protected navigateToPrimaryAction() {
    this.router.navigate([this.actionTarget()]).then();
  }
}
