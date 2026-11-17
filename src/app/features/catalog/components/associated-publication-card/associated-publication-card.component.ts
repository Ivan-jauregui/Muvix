import { Component, inject, input, Input, output } from '@angular/core';
import { Publication } from '../../../../core/models/publicacion';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';

@Component({
  selector: 'associated-publication-card',
  imports: [CommonModule],
  templateUrl: './associated-publication-card.component.html',
  styleUrl: './associated-publication-card.component.css'
})
export class AssociatedPublicationCard {

  associated_publication = input.required<PublicationResponse>();
  index = input<number>(0);
  total = input<number>(1);

  onSelect = output<string>();

  onCardClicked() {
    this.onSelect.emit(this.associated_publication().id);
  }

}
