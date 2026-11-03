import { Component, inject, input } from '@angular/core';
import { Publication } from '../../../../core/models/publicacion';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PublicationImages } from '../../../../core/models/publication-images';

@Component({
  selector: 'publication-card',
  imports: [DatePipe],
  templateUrl: './publication-card.component.html',
  styleUrl: './publication-card.component.css'
})
export class PublicationCardComponent {
  publication = input.required<Publication>();

  router = inject(Router);

  getMainImageUrl(publication: Publication): string {

    const images = publication.images;

    if (!images || images.length === 0) {
      return 'assets/no-image.jpg';
    }

    const principal = images.find(
      (img: PublicationImages) => img.esPrincipal
    );

    return principal
      ? principal.url_images
      : images[0].url_images;
  }

  getCategoryName(publication: Publication): string {

    const category = publication.category as unknown as {
      name?: string;
      nombre?: string;
      title?: string;
    };

    return category?.name ??
      category?.nombre ??
      category?.title ??
      '';
  }

  viewDetails(id?: string): void {

    if (id) {
      this.router.navigate(['/catalog', id]);
    }

  }

}
