import {Component, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Dark hardware identity card for the diagnostics view. The brand sits as
 * a faded watermark behind the Hardware ID and admin badge.
 */
@Component({
  selector: 'app-hardware-id-card',
  imports: [TranslatePipe],
  templateUrl: './hardware-id-card.html',
  styleUrl: './hardware-id-card.scss'
})
export class HardwareIdCard {
  hardwareId = input.required<string>();
  badge = input<string>('');
}
