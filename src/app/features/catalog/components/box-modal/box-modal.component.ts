import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';

import { PublicationResponse } from '../../../../core/models/dto/response/publication-response';
import { Box } from '../../../../core/models/box';
import { Router, RouterLink } from '@angular/router';
import { BoxService } from '../../../../core/services/box.service';

@Component({
  selector: 'box-modal',
  imports: [CommonModule,RouterLink],
  templateUrl: './box-modal.component.html',
  styleUrl: './box-modal.component.css'
})
export class BoxModalComponent {
  private authService = inject(AuthService);
  private boxService = inject(BoxService);

  private router = inject(Router);

  isOpen = input<boolean>(false);
  publication = input<PublicationResponse | null>(null);

  closed = output<void>();
  saved = output<Box>();

  currentUser = this.authService.currentUser;

  myBoxes = signal<Box[]>([]);
  loadingBoxes = signal(false);
  savingToBoxId = signal<string | number | null>(null);
  feedbackMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.feedbackMessage.set(null);
        this.loadCurrentUserBoxes();
      }
    });
  }

  close(): void {
    this.feedbackMessage.set(null);
    this.closed.emit();
  }

  private loadCurrentUserBoxes(): void {
    const loggedUser = this.currentUser();

    if (!loggedUser?.id) {
      this.myBoxes.set([]);
      return;
    }

    this.loadingBoxes.set(true);

    this.boxService.getAll().subscribe({
      next: (boxes) => {
        const userBoxes = boxes.filter(
          (box) => String(box.userId) === String(loggedUser.id)
        );
        this.myBoxes.set(userBoxes);
        this.loadingBoxes.set(false);
      },
      error: (err) => {
        console.error('Error al cargar las boxes del usuario:', err);
        this.myBoxes.set([]);
        this.loadingBoxes.set(false);
      }
    });
  }

  isPublicationInBox(box: Box): boolean {
    const pubId = this.publication()?.id;
    if (!pubId || !box.publications?.length) return false;
    return box.publications.some((p) => String(p.id) === String(pubId));
  }

  savePublicationToBox(box: Box): void {
    const pub = this.publication();
    if (!pub || !box.id) return;

    if (this.isPublicationInBox(box)) {
      this.feedbackMessage.set(`Ya está guardada en "${box.title}".`);
      return;
    }

    this.savingToBoxId.set(box.id);
    this.feedbackMessage.set(null);

    const updatedPublications = [...(box.publications || []), pub as any];

    this.boxService.patch(box.id, { publications: updatedPublications }).subscribe({
      next: (updatedBox) => {
        this.myBoxes.update((list) =>
          list.map((item) => (item.id === box.id ? updatedBox : item))
        );
        this.savingToBoxId.set(null);
        this.feedbackMessage.set(`Guardado en "${box.title}".`);
        this.saved.emit(updatedBox);
      },
      error: (err) => {
        console.error('Error al guardar publicación en la box:', err);
        this.savingToBoxId.set(null);
        this.feedbackMessage.set('No se pudo guardar en la box.');
      }
    });
  }

  goToLogin(): void {
    this.close();
    this.router.navigate(['/auth/login']);
  }
}
