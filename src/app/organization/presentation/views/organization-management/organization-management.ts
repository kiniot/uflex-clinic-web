import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';

@Component({
  selector: 'app-organization-management',
  imports: [TranslatePipe, PageHeader],
  template: `
    <app-page-header
      [title]="'clinicAdmin.organization.title' | translate"
      [subtitle]="'clinicAdmin.organization.subtitle' | translate"/>
  `
})
export class OrganizationManagement {}
