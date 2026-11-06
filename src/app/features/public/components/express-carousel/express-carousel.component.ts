import { Component, inject, signal } from '@angular/core';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { Publication } from '../../../../core/models/publicacion';
import { CommonModule } from '@angular/common';
import { PublicationImages } from '../../../../core/models/publication-images';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'express-carousel',
  imports: [CommonModule,RouterLink],
  templateUrl: './express-carousel.component.html',
  styleUrl: './express-carousel.component.css'
})
export class ExpressCarouselComponent {
    private publicationService = inject(PublicationService);

  publications = signal<Publication[]>([]);

  ngOnInit(): void {
    this.publicationService.getAll().subscribe({
      next: (publications) => {
        this.publications.set(publications);
      },
      error: (error) => {
        console.error('Error al obtener publicaciones:', error);
      }
    });
  }

  getMainImageUrl(publication: Publication): string {
      const images = publication?.images;
      if (!images || images.length === 0) return 'assets/no-image.jpg';
  
      // Busca la principal, si no existe, agarra la primera del array
      const principal = images.find((img: PublicationImages) => img.esPrincipal);
   
      return principal ? principal.url_images : images[0].url_images;
    }
}
