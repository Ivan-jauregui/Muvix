import { Component, inject, input, output } from '@angular/core';
import { Publication } from '../../../../../../core/models/publicacion';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPauseCircleMicro,heroPencilMicro } from '@ng-icons/heroicons/micro';
import { PublicationResponse } from '../../../../../../core/models/dto/response/publication-response';

@Component({
  selector: 'admin-publication-card',
  imports: [CommonModule, NgIcon, RouterLink],
   providers: [
        provideIcons({ 
        heroPauseCircleMicro,
        heroPencilMicro 
        })
      ],
  templateUrl: './admin-publication-card.component.html',
  styleUrl: './admin-publication-card.component.css'
})
export class AdminPublicationCardComponent {
  router = inject(Router)
  publication = input<PublicationResponse>();
  statusChanged = output<PublicationResponse>();

  viewDetails(id: string) {
    if (id) {
      this.router.navigate(['/catalog', id]);
    }
  }

  toggleStatus() {
    const pub = this.publication();
    if (!pub) return;

    const updatedPublication: PublicationResponse = {
      ...pub,
      status: pub.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    };

    this.statusChanged.emit(updatedPublication);
  }
}
