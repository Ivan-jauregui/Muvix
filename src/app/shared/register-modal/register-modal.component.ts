import { Component, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css'
})
export class RegisterModalComponent {

  private fb = inject(FormBuilder);

  open = input<boolean>(false);

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

  form: FormGroup = this.fb.group({
    firstName: ['', [
      Validators.required,
      Validators.minLength(2),
      this.noWhitespace
    ]],

    lastName: ['', [
      Validators.required,
      Validators.minLength(2),
      this.noWhitespace
    ]],

    email: ['', [
      Validators.required,
      Validators.email,
      this.noWhitespace
    ]],

    password: ['', [
      Validators.required,
      Validators.minLength(8),
      this.noWhitespace
    ]],

    phoneNumber: ['', [
      Validators.required,
      Validators.pattern(/^\+?[\d\s()-]{8,20}$/),
      this.noWhitespace
    ]],

    country: ['', [
      Validators.required,
      this.noWhitespace
    ]],

    state: ['', [
      Validators.required,
      this.noWhitespace
    ]],

    city: ['', [
      Validators.required,
      this.noWhitespace
    ]],

    address: ['', [
      Validators.required,
      Validators.minLength(5),
      this.noWhitespace
    ]]
  });

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get phoneNumber() {
    return this.form.get('phoneNumber');
  }

  get country() {
    return this.form.get('country');
  }

  get state() {
    return this.form.get('state');
  }

  get city() {
    return this.form.get('city');
  }

  get address() {
    return this.form.get('address');
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();

    const user: User = {
      photo:'',
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
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
