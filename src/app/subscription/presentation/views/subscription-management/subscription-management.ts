import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';

@Component({
  selector: 'app-subscription-management',
  imports: [TranslatePipe, PageHeader],
  template: `
    <app-page-header
      [title]="'clinicAdmin.subscription.title' | translate"
      [subtitle]="'clinicAdmin.subscription.subtitle' | translate"/>
  `
})
export class SubscriptionManagement {}
