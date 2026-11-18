
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { UserService } from '../../pages/service/user.service';
import { User } from '../../../../core/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  private router = inject(Router);

  currentUser = this.authService.currentUser;

  loading = false;
  successMessage = '';
  errorMessage = '';

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    address: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const user = this.currentUser();

    if (!user) return;

    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      country: user.country,
      state: user.state,
      city: user.city,
      address: user.address
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const user = this.currentUser();

    if (!user?.id) {
      this.errorMessage = 'No se pudo identificar al usuario.';
      return;
    }

    const updatedUser: User = {
      ...user,
      ...this.profileForm.getRawValue()
    };

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.update(user.id, updatedUser).subscribe({
      next: (response) => {
        this.authService.currentUser.set(response);
        this.loading = false;
        this.successMessage = 'Tu perfil se actualizó correctamente.';
        this.router.navigate(["/profile/me"])
      },
      error: (error) => {
        console.error('Error al actualizar el perfil:', error);
        this.loading = false;
        this.errorMessage = 'No se pudieron guardar los cambios.';
      }
    });
  }
}
