import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';
import {OrganizationStore} from '../../../application/organization.store';

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
  private store = inject(OrganizationStore);

  protected readonly photoFileName = signal<string | null>(null);
  protected readonly loading = signal<boolean>(false);

  form = new FormGroup({
    fullName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    specialty: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    countryCode: new FormControl('+51', {nonNullable: true, validators: [Validators.required]}),
    phoneNumber: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    licenseNumber: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    professionalSummary: new FormControl('', {nonNullable: true}),
    yearsOfExperience: new FormControl(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]})
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
    this.loading.set(true);

    this.store.registerPhysiotherapist({
      fullName: value.fullName,
      specialty: value.specialty,
      email: value.email,
      countryCode: value.countryCode,
      phoneNumber: value.phoneNumber,
      licenseNumber: value.licenseNumber,
      professionalSummary: value.professionalSummary,
      photoUrl: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(value.fullName) + '&background=random&color=fff&size=128',
      yearsOfExperience: value.yearsOfExperience
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/clinic-admin/organization']);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Failed to register physiotherapist', err);
      }
    });
  }
}