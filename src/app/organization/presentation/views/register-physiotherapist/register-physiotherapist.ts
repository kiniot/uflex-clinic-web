import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';
import {RegisterPhysiotherapistCommand} from '../../../domain/model/register-physiotherapist.command';

/**
 * View for onboarding a new physiotherapist to the clinic. Replaces the
 * Organization content with a two-column form (personal info + clinical
 * credentials on the main column; profile photo upload, a quick tip, and
 * a recent enrollments preview on the side).
 */
@Component({
  selector: 'app-register-physiotherapist',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    ButtonModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './register-physiotherapist.html',
  styleUrl: './register-physiotherapist.scss'
})
export class RegisterPhysiotherapist extends BaseForm {
  private router = inject(Router);

  protected readonly photoFileName = signal<string | null>(null);

  form = new FormGroup({
    fullName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    specialty: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    phone: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    licenseNumber: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    professionalSummary: new FormControl('', {nonNullable: true})
  });

  protected onPhotoPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.photoFileName.set(file?.name ?? null);
  }

  protected onCancel() {
    this.router.navigate(['/clinic-admin/organization']);
  }

  protected onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    const command = new RegisterPhysiotherapistCommand({
      fullName: value.fullName,
      specialty: value.specialty,
      email: value.email,
      phone: value.phone,
      licenseNumber: value.licenseNumber,
      professionalSummary: value.professionalSummary,
      photoFileName: this.photoFileName()
    });
    console.log('Register physiotherapist command', command);
    this.router.navigate(['/clinic-admin/organization']);
  }
}
