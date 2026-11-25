import { Component, inject, input } from '@angular/core';
import { Publication } from '../../../../core/models/publicacion';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';

@Component({
  selector: 'publication-card',
  imports: [DatePipe],
  templateUrl: './publication-card.component.html',
  styleUrl: './publication-card.component.css'
})
export class PublicationCardComponent {
  publication = input.required<PublicationResponse>();

  router = inject(Router);

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
