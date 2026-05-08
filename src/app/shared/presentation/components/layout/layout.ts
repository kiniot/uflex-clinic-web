import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

/**
 * Root layout component. Renders only the routed view; chrome (headers, footers,
 * toolbars) is composed by each view that needs it.
 */
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {}
