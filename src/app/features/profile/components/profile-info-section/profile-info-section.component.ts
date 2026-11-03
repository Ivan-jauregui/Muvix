import { Component, input } from '@angular/core';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'profile-info-section',
  imports: [],
  templateUrl: './profile-info-section.component.html',
  styleUrl: './profile-info-section.component.css'
})
export class ProfileInfoSectionComponent {
  user = input.required<User>()
  totalCount = input<number | null>(null)  
}
