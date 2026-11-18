import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { LoginCredentials, LoginModalComponent } from '../login-modal/login-modal.component';
import { User } from '../../core/models/user';
import { RegisterModalComponent } from '../register-modal/register-modal.component';

import {
  heroHome, heroFilm, heroUserCircle, heroTicket, heroSquares2x2,
  heroBell, heroChevronDown, heroMagnifyingGlass, heroQuestionMarkCircle, heroInboxStack
} from '@ng-icons/heroicons/outline';
import {
  heroHomeSolid, heroFilmSolid, heroUserCircleSolid, heroUserSolid, heroQuestionMarkCircleSolid
} from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIcon,
    LoginModalComponent,
    RegisterModalComponent
  ],
  providers: [provideIcons({
    heroHome, heroFilm, heroUserCircle, heroTicket, heroSquares2x2, heroBell,
    heroChevronDown, heroMagnifyingGlass, heroQuestionMarkCircle, heroInboxStack,
    heroHomeSolid, heroFilmSolid, heroUserCircleSolid, heroUserSolid, heroQuestionMarkCircleSolid
  })],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  googleRegister() {
    throw new Error('Method not implemented.');
  }
  public authService = inject(AuthService);
  private router = inject(Router);


  showAccountMenu = signal(false);
  showLogin = signal(false);
  showRegister = signal(false);
  loading = signal(false);
  


  openRegister(): void {
    this.showLogin.set(false);
    this.showRegister.set(true);
  }
  openLogin(): void {
    this.showLogin.set(true);
  }
  closeLogin(): void {
    this.showLogin.set(false);
  }
  closeRegister(): void {
    this.showRegister.set(false);
  }

  createAccount(user: User): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.authService.register(user).subscribe({
      next: (data) => {
        this.loading.set(false);
        this.closeRegister();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error de credenciales:', err);
        window.alert('Ocurrió un error al registarse.');
      }
    });
  }


  login(credentials: LoginCredentials): void {
    if (this.loading()) return;
    this.loading.set(true);

    this.authService.login(
      credentials.email,
      credentials.password
    ).subscribe({
      next: (isLoggedIn: boolean) => {
        this.loading.set(false);
        if (isLoggedIn) {
          this.closeLogin();
          this.router.navigate(['/']);
        } else {
          window.alert('Correo o contraseña incorrectos.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error de credenciales:', err);
        window.alert('Ocurrió un error al iniciar sesión.');
      }
    });
  }


  toggleAccountMenu(): void {
    this.showAccountMenu.update(value => !value);
  }

  recoverPassword(email: string): void {

    if (!email) {
      window.alert('Ingresá tu correo electrónico para recuperar tu contraseña.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      window.alert('Ingresá un correo electrónico válido.');
      return;
    }

    console.log('Recuperar contraseña:', email);
  }

  register(): void {
    this.closeLogin();
    this.router.navigate(['/register']);
  }
}
