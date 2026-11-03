import { Component, OnInit, inject, signal } from '@angular/core';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { Publication } from '../../../../core/models/publicacion';
import { CommonModule } from '@angular/common';
import { PublicationImages } from '../../../../core/models/publication-images';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listings',
  imports: [CommonModule],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit{
  private readonly publicationService = inject(PublicationService);
  publications = signal<Publication[]>([])

  private router = inject(Router)

  ngOnInit(): void {
    this.loadPublications("1")
  }

  private loadPublications(userId: string): void {

    this.publicationService.getAll().subscribe({
      next: (data: Publication[]) => {

        // Mostramos solamente las publicaciones del usuario del perfil
        const userPublications = data.filter(
          publication => publication.userId === userId
        );

        this.publications.set(userPublications);
      },

      error: (err) => {
        console.error('Error al cargar publicaciones:', err);
      }
    });
  }

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
}
