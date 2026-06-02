import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { PhysiotherapistProfile } from '../../../domain/model/physiotherapist-profile.entity';

@Component({
  selector: 'app-physiotherapists-table',
  imports: [TranslatePipe, AvatarModule, ButtonModule],
  templateUrl: './physiotherapists-table.html',
  styleUrl: './physiotherapists-table.scss',
})
export class PhysiotherapistsTable {
  physiotherapists = input.required<PhysiotherapistProfile[]>();

  readonly rowOpen = output<PhysiotherapistProfile>();

  protected initialsFor(fullName: string): string {
    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((segment) => segment.charAt(0).toUpperCase())
      .join('');
  }

  protected onRowOpen(physiotherapist: PhysiotherapistProfile) {
    this.rowOpen.emit(physiotherapist);
  }
}
