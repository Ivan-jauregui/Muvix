import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCalendarDays, heroMagnifyingGlass, heroPlus } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-navbar', 
    imports: [
    RouterLink,
    RouterLinkActive,
    NgIconComponent
  ],
  providers: [
    provideIcons({
      heroMagnifyingGlass,
      heroCalendarDays,
      heroPlus
    })
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
