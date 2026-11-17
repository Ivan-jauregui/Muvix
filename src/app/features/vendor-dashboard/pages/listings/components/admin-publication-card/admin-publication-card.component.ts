import { Component, inject, input, output } from '@angular/core';
import { Publication } from '../../../../../../core/models/publicacion';
import { PublicationImages } from '../../../../../../core/models/publication-images';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPauseCircleMicro,heroPencilMicro } from '@ng-icons/heroicons/micro';
import { PublicationResponse } from '../../../../../../core/models/dto/response/publication-response';

@Component({
  selector: 'admin-publication-card',
  imports: [CommonModule,NgIcon],
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
  statusChanged = output<PublicationResponse>()

  viewDetails(id: string) {
    if (id) {
      this.router.navigate(['/catalog', id]);
    }
  }

  toggleStatus(){
    const currentPub = this.publication();
    if (!currentPub) return;

    const updatedPublication: PublicationResponse = {
      ...currentPub,
      status: "ACTIVE"
    };

    this.statusChanged.emit(updatedPublication);
  }
}
