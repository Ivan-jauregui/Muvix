import { Component, inject, signal } from '@angular/core';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { Publication } from '../../../../core/models/publicacion';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';


@Component({
  selector: 'express-carousel',
  imports: [CommonModule,RouterLink],
  templateUrl: './express-carousel.component.html',
  styleUrl: './express-carousel.component.css'
})
export class ExpressCarouselComponent {
   private publicationService = inject(PublicationService);
  
    publications = signal<PublicationResponse[]>([]);
  
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
}
