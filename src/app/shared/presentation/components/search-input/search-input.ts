import {Component, input, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';

/**
 * Reusable search input with a leading magnifier icon. Wraps PrimeNG's
 * IconField + InputIcon + InputText composition so callers don't have to
 * repeat the markup.
 */
@Component({
  selector: 'app-search-input',
  imports: [FormsModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss'
})
export class SearchInput {
  placeholder = input<string>('');
  value = input<string>('');
  fluid = input<boolean>(true);

  readonly valueChange = output<string>();

  protected onInput(next: string) {
    this.valueChange.emit(next);
  }
}
