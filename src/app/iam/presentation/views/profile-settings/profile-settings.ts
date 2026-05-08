import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';

@Component({
  selector: 'app-profile-settings',
  imports: [TranslatePipe, PageHeader],
  template: `
    <app-page-header
      [title]="'clinicAdmin.profile.title' | translate"
      [subtitle]="'clinicAdmin.profile.subtitle' | translate"/>
  `
})
export class ProfileSettings {}
