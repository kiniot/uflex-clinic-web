import {Component, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {DiagnosticLogEntry} from '../../../domain/model/diagnostics.types';

/**
 * Terminal-style log card showing the live diagnostic stream. Each entry
 * is rendered with a monospace timestamp, a colored scope tag, the
 * message, and an optional inline highlight (success / warning / error).
 */
@Component({
  selector: 'app-diagnostic-log',
  imports: [TranslatePipe],
  templateUrl: './diagnostic-log.html',
  styleUrl: './diagnostic-log.scss'
})
export class DiagnosticLog {
  filename = input<string>('uflex-core-init.sh');
  entries = input.required<DiagnosticLogEntry[]>();

  readonly clear = output<void>();

  protected onClear() { this.clear.emit(); }
}
