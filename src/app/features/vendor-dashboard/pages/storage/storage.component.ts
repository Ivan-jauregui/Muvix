import { Component, inject, signal } from '@angular/core';
import { PublicationImages } from '../../../../core/models/publication-images';
import { Publication } from '../../../../core/models/publicacion';
import { PublicationService } from '../../../../core/services/publication/publication-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-storage',
  imports: [],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})
export class StorageComponent {
  private readonly publicationService = inject(PublicationService);
  public publications = signal<Publication[]>([]);

 
 ngOnInit(): void {
    this.loadPublications();
  }

  private loadPublications(): void {
    this.publicationService.getAll().subscribe({
      next: (data) => {
        this.publications.set(data.filter(p=>p.price===0));
      },
      error: (err) => {
        console.error('Error al cargar las publicaciones:', err);
      }
    });
  }

  getMainImageUrl(publication: Publication): string {
    const images = publication?.images;
    if (!images || images.length === 0) return 'assets/no-image.jpg';


    const principal = images.find((img: PublicationImages) => img.esPrincipal);
 
    return principal ? principal.url_images : images[0].url_images;
  }
}
