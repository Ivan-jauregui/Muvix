import { Component, inject, signal } from '@angular/core';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { Publication } from '../../../../core/models/publicacion';
import { CommonModule, DatePipe } from '@angular/common';
import { PublicationImages } from '../../../../core/models/publication-images';
import { RouterLink } from '@angular/router';
import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';

@Component({
  selector: 'publication-carrousel',
  imports: [CommonModule,DatePipe,RouterLink],
  templateUrl: './publication-carrousel.component.html',
  styleUrl: './publication-carrousel.component.css'
})
export class PublicationCarrouselComponent {
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
