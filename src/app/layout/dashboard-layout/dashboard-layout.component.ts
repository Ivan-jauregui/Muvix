import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DashboardAsideComponent } from '../../shared/dashboard-aside/dashboard-aside.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { User } from '../../core/models/user';
import { PublicationService } from '../../core/services/publication/publication-service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterOutlet, RouterLink,DashboardAsideComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit{
  private readonly authService = inject(AuthService);
  user = signal<User | null>(null)

  ngOnInit(): void {
    this.user.set(this.authService.currentUser())
  }
}
