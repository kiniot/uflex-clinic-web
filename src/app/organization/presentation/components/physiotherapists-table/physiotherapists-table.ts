import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { PhysiotherapistProfile } from '../../../domain/model/physiotherapist-profile.entity';

@Component({
  selector: 'app-physiotherapists-table',
  imports: [TranslatePipe, AvatarModule, ButtonModule, TooltipModule],
  templateUrl: './physiotherapists-table.html',
  styleUrl: './physiotherapists-table.scss',
})
export class PhysiotherapistsTable {
  physiotherapists = input.required<PhysiotherapistProfile[]>();

  readonly rowOpen = output<PhysiotherapistProfile>();
  readonly edit = output<PhysiotherapistProfile>();
  readonly toggleStatus = output<PhysiotherapistProfile>();
  readonly delete = output<PhysiotherapistProfile>();

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

  protected onEdit(physiotherapist: PhysiotherapistProfile) {
    this.edit.emit(physiotherapist);
  }

  protected onToggleStatus(physiotherapist: PhysiotherapistProfile) {
    this.toggleStatus.emit(physiotherapist);
  }

  protected onDelete(physiotherapist: PhysiotherapistProfile) {
    this.delete.emit(physiotherapist);
  }

  protected statusActionKey(physiotherapist: PhysiotherapistProfile): string {
    return physiotherapist.status === 'SUSPENDED'
      ? 'organization.physiotherapists.actions.reactivate'
      : 'organization.physiotherapists.actions.suspend';
  }

  protected statusActionIcon(physiotherapist: PhysiotherapistProfile): string {
    return physiotherapist.status === 'SUSPENDED' ? 'pi pi-play' : 'pi pi-pause';
  }

  protected statusActionSeverity(
    physiotherapist: PhysiotherapistProfile,
  ): 'secondary' | 'warn' {
    return physiotherapist.status === 'SUSPENDED' ? 'secondary' : 'warn';
  }
}
