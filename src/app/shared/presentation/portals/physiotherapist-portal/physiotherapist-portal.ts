import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Placeholder physiotherapist portal. Will be expanded into a full role
 * shell (sidebar + topbar + composed bounded-context views) once the
 * physiotherapist mockups are designed.
 */
@Component({
  selector: 'app-physiotherapist-portal',
  imports: [TranslatePipe],
  templateUrl: './physiotherapist-portal.html',
  styleUrl: './physiotherapist-portal.scss'
})
export class PhysiotherapistPortal {}
