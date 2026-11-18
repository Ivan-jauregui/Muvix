import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroShieldCheck,
  heroChartBar,
  heroArchiveBox,
  heroTag,
  heroKey,
  heroUser,
  heroArrowLeftOnRectangle,
  heroBars3,
  heroXMark
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'dashboard-aside',
  imports: [RouterLink, RouterLinkActive, NgIcon],
  providers: [
    provideIcons({
      heroShieldCheck,
      heroChartBar,
      heroArchiveBox,
      heroTag,
      heroKey,
      heroUser,
      heroArrowLeftOnRectangle,
      heroBars3,
      heroXMark
    })
  ],
  templateUrl: './dashboard-aside.component.html',
  styleUrl: './dashboard-aside.component.css',
})
export class DashboardAsideComponent {
  isSidebarOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  logout(): void {
    this.closeSidebar();
    console.log('Cerrando sesión...');
  }
}