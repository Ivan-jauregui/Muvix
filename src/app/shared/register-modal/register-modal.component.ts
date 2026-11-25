import { Component, inject, input, output, signal } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, first, map, of, switchMap } from 'rxjs';
import { User } from '../../core/models/user';
import { AuthService } from '../../core/services/auth/auth.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEye, heroEyeSlash, heroXMark } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  providers: [
    provideIcons({ heroXMark, heroEye, heroEyeSlash })
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css'
})
export class RegisterModalComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  open = input<boolean>(false);
  serverError = input<string | null>(null);

  closed = output<void>();
  submitted = output<User>();
  googleRegister = output<void>();
  login = output<void>();

  showPassword = signal(false);

  noWhitespace(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string') return null;
    return value.trim().length === 0 ? { whitespace: true } : null;
  }

  private emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const value = (control.value ?? '').trim().toLowerCase();
      if (!value || control.hasError('email')) return of(null);

      return of(value).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(email =>
          this.authService.checkEmailExists(email).pipe(
            map(exists => (exists ? { emailTaken: true } : null)),
            catchError(() => of(null))
          )
        ),
        first()
      );
    };
  }

  private phoneExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const value = (control.value ?? '').trim();
      if (!value || control.hasError('pattern')) return of(null);

      return of(value).pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(phone =>
          this.authService.checkPhoneExists(phone).pipe(
            map(exists => (exists ? { phoneTaken: true } : null)),
            catchError(() => of(null))
          )
        ),
        first()
      );
    };
  }

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), this.noWhitespace]],
    lastName: ['', [Validators.required, Validators.minLength(2), this.noWhitespace]],
    email: [
      '',
      [Validators.required, Validators.email, this.noWhitespace],
      [this.emailExistsValidator()]
    ],
    password: ['', [Validators.required, Validators.minLength(8), this.noWhitespace]],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern(/^\+?[\d\s()-]{8,20}$/), this.noWhitespace],
      [this.phoneExistsValidator()]
    ],
    country: ['', [Validators.required, this.noWhitespace]],
    state: ['', [Validators.required, this.noWhitespace]],
    city: ['', [Validators.required, this.noWhitespace]],
    address: ['', [Validators.required, Validators.minLength(5), this.noWhitespace]]
  });

  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get phoneNumber() { return this.form.get('phoneNumber'); }
  get country() { return this.form.get('country'); }
  get state() { return this.form.get('state'); }
  get city() { return this.form.get('city'); }
  get address() { return this.form.get('address'); }

  setDuplicateErrors(errors: { emailTaken?: boolean; phoneTaken?: boolean }): void {
    if (errors.emailTaken) {
      this.email?.setErrors({ ...(this.email.errors ?? {}), emailTaken: true });
      this.email?.markAsTouched();
    }
    if (errors.phoneTaken) {
      this.phoneNumber?.setErrors({ ...(this.phoneNumber.errors ?? {}), phoneTaken: true });
      this.phoneNumber?.markAsTouched();
    }
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  close(): void {
    this.form.reset();
    this.showPassword.set(false);
    this.closed.emit();
  }

  submit(): void {
    if (this.form.pending) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();

    const user: User = {
      photo: '',
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      phoneNumber: values.phoneNumber.trim(),
      country: values.country.trim(),
      state: values.state.trim(),
      city: values.city.trim(),
      address: values.address.trim()
    };

    this.submitted.emit(user);
  }

  onGoogleRegister(): void {
    this.googleRegister.emit();
  }

  onLogin(): void {
    this.login.emit();
  }
}