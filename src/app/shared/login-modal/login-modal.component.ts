
import { Component, input, output, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {

  private fb = inject(FormBuilder);

  open = input<boolean>(false);

  closed = output<void>();
  login = output<LoginCredentials>();
  googleLogin = output<void>();
  forgotPassword = output<string>();
  register = output<void>();

  showPassword = signal(false);

  noWhitespace(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (typeof value !== 'string') return null;

    return value.trim().length === 0 ? { whitespace: true } : null;
  }

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email, this.noWhitespace ]],
    password: ['',[Validators.required, Validators.minLength(4), this.noWhitespace]]
  });

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
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

    const credentials: LoginCredentials = this.form.getRawValue();

    credentials.email = credentials.email.trim();

    this.login.emit(credentials);
  }

  recoverPassword(): void {
    const email = this.email?.value?.trim() ?? '';
    this.forgotPassword.emit(email);
  }

  onRegister(): void {
    this.register.emit();
  }

  onGoogleLogin(): void {
    this.googleLogin.emit();
  }
}
