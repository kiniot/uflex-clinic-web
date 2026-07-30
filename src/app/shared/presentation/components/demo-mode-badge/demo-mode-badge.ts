import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Compact "DEMO" badge shown in the topbar while a "Ver demo" guest session is active.
 * Lives inline with the role pill so it never shifts page content, unlike a full-width banner.
 * Reused by any portal shell (physiotherapist today, clinic-admin later).
 */
@Component({
  selector: 'app-demo-mode-badge',
  imports: [TranslatePipe],
  templateUrl: './demo-mode-badge.html',
  styleUrl: './demo-mode-badge.scss',
})
export class DemoModeBadge {
  private router = inject(Router);
  private translate = inject(TranslateService);
  protected iamStore = inject(IamStore);

  protected get tooltip(): string {
    return this.translate.instant('demoBadge.tooltip');
  }

  protected exitDemo() {
    this.iamStore.exitDemoSession();
    this.router.navigate(['/sign-in']).then();
  }
}
