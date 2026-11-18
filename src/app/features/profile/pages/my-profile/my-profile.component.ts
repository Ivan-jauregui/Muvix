import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import {
  heroMapPin,
  heroShieldCheck,
  heroUserCircle,
  heroUser,
  heroLockClosed,
  heroPencil,
  heroCamera 
} from '@ng-icons/heroicons/outline';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { CloudinaryService } from '../../../../core/services/cloudinary/cloudinary.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-my-profile',
  imports: [
    CommonModule,
    RouterLink,
    NgIcon
  ],
  providers: [
    provideIcons({
      heroMapPin,
      heroShieldCheck,
      heroUserCircle,
      heroUser,
      heroCamera,
      heroLockClosed,
      heroPencil

    })
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  private authService = inject(AuthService);
  private cloudinaryService = inject(CloudinaryService);  
  private userService = inject(UserService);  

  currentUser = this.authService.currentUser;
uploadingPhoto = false;

onPhotoSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    console.error('El archivo debe ser una imagen.');
    input.value = '';
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    console.error('La imagen no puede superar los 5 MB.');
    input.value = '';
    return;
  }

  const user = this.currentUser();

  if (!user?.id) return;

  this.uploadingPhoto = true;

  this.cloudinaryService.uploadImage(file).subscribe({
    next: (imageUrl) => {
      const updatedUser = {
        ...user,
        photo: imageUrl
      };

      this.userService.update(user.id!, updatedUser).subscribe({
        next: (data) => {
          this.currentUser.set(data);
          this.uploadingPhoto = false;
          input.value = '';
        },
        error: (err) => {
          console.error('Error al actualizar el perfil:', err);
          this.uploadingPhoto = false;
          input.value = '';
        }
      });
    },
    error: (error) => {
      console.error('Error al subir la imagen:', error);
      this.uploadingPhoto = false;
      input.value = '';
    }
  });
}
}
