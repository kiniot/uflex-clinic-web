import {Component, input} from '@angular/core';

/**
 * Page-level header with a title, optional subtitle, and a right-aligned
 * slot for primary actions (e.g. "Register New Exercise"). Used inside an
 * admin shell to keep page intros consistent.
 */
@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss'
})
export class PageHeader {
  title = input.required<string>();
  subtitle = input<string>('');
}
