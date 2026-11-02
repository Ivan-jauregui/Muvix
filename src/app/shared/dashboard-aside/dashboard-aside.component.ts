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
  heroArrowLeftOnRectangle 
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'dashboard-aside',
  imports: [RouterLink,RouterLinkActive,NgIcon],
  providers: [
    provideIcons({ 
      heroShieldCheck, 
      heroChartBar, 
      heroArchiveBox, 
      heroTag, 
      heroKey, 
      heroUser, 
      heroArrowLeftOnRectangle 
    })
  ],
  templateUrl: './dashboard-aside.component.html',
  styleUrl: './dashboard-aside.component.css',
})
export class DashboardAsideComponent {
  isSidebarOpen = signal<boolean>(false);

  toggleSidebar() {
    this.isSidebarOpen.update(value => !value);
  }

  logout() {
    console.log('Cerrando sesión...');

  }
}
