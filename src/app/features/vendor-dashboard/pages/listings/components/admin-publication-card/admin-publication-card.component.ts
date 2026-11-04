import { Component, inject, input, output } from '@angular/core';
import { Publication } from '../../../../../../core/models/publicacion';
import { PublicationImages } from '../../../../../../core/models/publication-images';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPauseCircleMicro,heroPencilMicro } from '@ng-icons/heroicons/micro';

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
  publication = input<Publication>();
  statusChanged = output<Publication>()


  getMainImageUrl(publication: Publication): string {
    const images = publication?.images;
    if (!images || images.length === 0) return 'assets/no-image.jpg';

    const principal = images.find((img: PublicationImages) => img.esPrincipal);

    return principal ? principal.url_images : images[0].url_images;
  }

  viewDetails(id: string) {
    if (id) {
      this.router.navigate(['/catalog', id]);
    }
  }

  toggleStatus(){
    const currentPub = this.publication();
    if (!currentPub) return;

    const updatedPublication: Publication = {
      ...currentPub,
      active: !currentPub.active
    };

    this.statusChanged.emit(updatedPublication);
  }
}
